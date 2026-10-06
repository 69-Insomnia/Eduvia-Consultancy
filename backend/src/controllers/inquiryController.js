import Inquiry from '../models/Inquiry.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const createInquiry = asyncHandler(async (req, res) => {
  const { fullName, phone, email, preferredCountry, highestEducation, interestedCourse, preferredIntake, englishTest, message, source } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ success: false, message: 'Full name and phone are required' });
  }

  const inquiry = await Inquiry.create({
    fullName,
    phone,
    email,
    preferredCountry,
    highestEducation,
    interestedCourse,
    preferredIntake,
    englishTest,
    message,
    source,
  });

  res.status(201).json({ success: true, inquiry });
});

export const getInquiries = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, source, assignedCounselor } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (assignedCounselor) filter.assignedCounselor = assignedCounselor;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Inquiry.countDocuments(filter);
  const inquiries = await Inquiry.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(setTotal(total).limit)
    .populate('assignedCounselor', 'name email');

  res.json({ success: true, inquiries, pagination: setTotal(total) });
});

export const getInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id).populate('assignedCounselor', 'name email');
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  res.json({ success: true, inquiry });
});

export const updateInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  res.json({ success: true, inquiry });
});

export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  res.json({ success: true, message: 'Inquiry deleted successfully' });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'contacted', 'counselingScheduled', 'profileEvaluated', 'applicationStarted', 'converted', 'closed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }

  res.json({ success: true, inquiry });
});

export const addNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: 'Note text is required' });
  }

  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }

  inquiry.notes.push({ text, createdBy: req.admin._id });
  await inquiry.save();

  res.json({ success: true, inquiry });
});
