import Student from '../models/Student.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const createStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  if (!firstName || !lastName || !email || !phone) {
    return res
      .status(400)
      .json({ success: false, message: 'First name, last name, email, and phone are required' });
  }

  const existing = await Student.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Student with this email already exists' });
  }

  const student = await Student.create(req.body);
  res.status(201).json({ success: true, student });
});

export const getStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, source, preferredCountry } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (preferredCountry) filter.preferredCountries = { $in: [preferredCountry] };
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Student.countDocuments(filter);
  const students = await Student.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(setTotal(total).limit);

  res.json({ success: true, students, pagination: setTotal(total) });
});

export const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json({ success: true, student });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json({ success: true, student });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json({ success: true, message: 'Student deleted successfully' });
});
