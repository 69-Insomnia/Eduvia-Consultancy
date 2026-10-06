import Application from '../models/Application.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const createApplication = asyncHandler(async (req, res) => {
  const { student, university, course, intake, year } = req.body;
  if (!student || !university || !course || !intake || !year) {
    return res
      .status(400)
      .json({ success: false, message: 'Student, university, course, intake, and year are required' });
  }

  const application = await Application.create(req.body);
  await application.populate(['student', 'university']);
  res.status(201).json({ success: true, application });
});

export const getApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, student, university } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (student) filter.student = student;
  if (university) filter.university = university;
  if (search) {
    filter.$or = [{ course: { $regex: search, $options: 'i' } }, { notes: { $regex: search, $options: 'i' } }];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Application.countDocuments(filter);
  const applications = await Application.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(setTotal(total).limit)
    .populate('student', 'firstName lastName email phone')
    .populate('university', 'name country city');

  res.json({ success: true, applications, pagination: setTotal(total) });
});

export const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('student')
    .populate('university');
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  res.json({ success: true, application });
});

export const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('student', 'firstName lastName email')
    .populate('university', 'name country');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  res.json({ success: true, application });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
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

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
    .populate('student', 'firstName lastName email')
    .populate('university', 'name country');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  res.json({ success: true, application });
});
