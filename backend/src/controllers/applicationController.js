import { Op } from 'sequelize';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import University from '../models/University.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { iLike } from '../utils/search.js';
import { cleanBody, takeRef } from '../utils/shape.js';

const STUDENT_LIST = ['id', 'firstName', 'lastName', 'email', 'phone'];
const STUDENT_EDIT = ['id', 'firstName', 'lastName', 'email'];
const UNIVERSITY_LIST = ['id', 'name', 'country', 'city'];
const UNIVERSITY_EDIT = ['id', 'name', 'country'];

// Mongoose cast body relations (raw id, populated doc or `''`) to an ObjectId; unwrap them to the id here.
const refId = (v) => (v && typeof v === 'object' ? v._id ?? v.id ?? null : v === '' ? null : v);

const applicationBody = (body) => {
  const data = takeRef(takeRef(cleanBody(body), 'student'), 'university');
  if (data.studentId !== undefined) data.studentId = refId(data.studentId);
  if (data.universityId !== undefined) data.universityId = refId(data.universityId);
  return data;
};

const refsInclude = (studentAttributes, universityAttributes) => [
  { model: Student, as: 'student', attributes: studentAttributes },
  { model: University, as: 'university', attributes: universityAttributes },
];

export const createApplication = asyncHandler(async (req, res) => {
  const { student, university, course, intake, year } = req.body;
  if (!student || !university || !course || !intake || !year) {
    return res
      .status(400)
      .json({ success: false, message: 'Student, university, course, intake, and year are required' });
  }

  let application = await Application.create(applicationBody(req.body));
  application = await Application.findByPk(application.id, { include: refsInclude() });
  res.status(201).json({ success: true, application });
});

export const getApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, student, university } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (student) filter.studentId = student;
  if (university) filter.universityId = university;
  if (search) {
    filter[Op.or] = [
      { course: iLike(search) },
      { notes: iLike(search) },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Application.count({ where: filter });
  const applications = await Application.findAll({
    where: filter,
    order: [['createdAt', 'DESC']],
    offset: skip,
    limit: setTotal(total).limit,
    include: refsInclude(STUDENT_LIST, UNIVERSITY_LIST),
  });

  res.json({ success: true, applications, pagination: setTotal(total) });
});

export const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByPk(req.params.id, { include: refsInclude() });
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  res.json({ success: true, application });
});

export const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByPk(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  application.set(applicationBody(req.body));
  await application.save();
  const reloaded = await Application.findByPk(application.id, {
    include: refsInclude(STUDENT_EDIT, UNIVERSITY_EDIT),
  });
  res.json({ success: true, application: reloaded });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByPk(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  await application.destroy();
  res.json({ success: true, message: 'Application deleted successfully' });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = [
    'draft', 'submitted', 'underReview', 'conditionalOffer', 'fullOffer',
    'rejected', 'visaApplied', 'visaApproved', 'visaRejected', 'enrolled', 'deferred',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const application = await Application.findByPk(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  application.status = status;
  await application.save();
  const reloaded = await Application.findByPk(application.id, {
    include: refsInclude(STUDENT_EDIT, UNIVERSITY_EDIT),
  });
  res.json({ success: true, application: reloaded });
});
