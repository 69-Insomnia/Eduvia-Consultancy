import { Op } from 'sequelize';
import Inquiry from '../models/Inquiry.js';
import Admin from '../models/Admin.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { iLike } from '../utils/search.js';
import { cleanBody, takeRef } from '../utils/shape.js';

const counselorInclude = () => ({
  model: Admin,
  as: 'assignedCounselor',
  attributes: ['id', 'name', 'email'],
});

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
  if (assignedCounselor) filter.assignedCounselorId = assignedCounselor;
  if (search) {
    filter[Op.or] = [
      { fullName: iLike(search) },
      { email: iLike(search) },
      { phone: iLike(search) },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Inquiry.count({ where: filter });
  const inquiries = await Inquiry.findAll({
    where: filter,
    order: [['createdAt', 'DESC NULLS LAST']],
    offset: skip,
    limit: setTotal(total).limit,
    include: [counselorInclude()],
  });

  res.json({ success: true, inquiries, pagination: setTotal(total) });
});

export const getInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByPk(req.params.id, {
    include: [counselorInclude()],
  });
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  res.json({ success: true, inquiry });
});

export const updateInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByPk(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  inquiry.set(takeRef(cleanBody(req.body), 'assignedCounselor'));
  await inquiry.save();
  res.json({ success: true, inquiry });
});

export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByPk(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  await inquiry.destroy();
  res.json({ success: true, message: 'Inquiry deleted successfully' });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'contacted', 'counselingScheduled', 'profileEvaluated', 'applicationStarted', 'converted', 'closed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const inquiry = await Inquiry.findByPk(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }

  inquiry.set({ status });
  await inquiry.save();

  res.json({ success: true, inquiry });
});

export const addNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: 'Note text is required' });
  }

  const inquiry = await Inquiry.findByPk(req.params.id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }

  inquiry.notes = [...(inquiry.notes || []), { text, createdBy: req.admin.id }];
  await inquiry.save();

  res.json({ success: true, inquiry });
});
