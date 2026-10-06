import { Op } from 'sequelize';
import Student from '../models/Student.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { iLike } from '../utils/search.js';
import { cleanBody, takeRef } from '../utils/shape.js';

// Mongoose cast body relations (raw id, populated doc or `''`) to an ObjectId; unwrap them to the id here.
const refId = (v) => (v && typeof v === 'object' ? v._id ?? v.id ?? null : v === '' ? null : v);

const studentBody = (body) => {
  const data = takeRef(cleanBody(body), 'user');
  if (data.userId !== undefined) data.userId = refId(data.userId);
  return data;
};

export const createStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  if (!firstName || !lastName || !email || !phone) {
    return res
      .status(400)
      .json({ success: false, message: 'First name, last name, email, and phone are required' });
  }

  const existing = await Student.findOne({ where: { email } });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Student with this email already exists' });
  }

  const student = await Student.create(studentBody(req.body));
  res.status(201).json({ success: true, student });
});

export const getStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, source, preferredCountry } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (preferredCountry) filter.preferredCountries = { [Op.contains]: [preferredCountry] };
  if (search) {
    filter[Op.or] = [
      { firstName: iLike(search) },
      { lastName: iLike(search) },
      { email: iLike(search) },
      { phone: iLike(search) },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Student.count({ where: filter });
  const students = await Student.findAll({
    where: filter,
    order: [['createdAt', 'DESC']],
    offset: skip,
    limit: setTotal(total).limit,
  });

  res.json({ success: true, students, pagination: setTotal(total) });
});

export const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json({ success: true, student });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  student.set(studentBody(req.body));
  await student.save();
  res.json({ success: true, student });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  await student.destroy();
  res.json({ success: true, message: 'Student deleted successfully' });
});
