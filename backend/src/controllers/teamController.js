import TeamMember from '../models/TeamMember.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const getTeamMembers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  const { skip, setTotal } = paginate(page, limit);
  const total = await TeamMember.countDocuments(filter);
  const members = await TeamMember.find(filter)
    .sort({ order: 1, createdAt: 1 })
    .skip(skip)
    .limit(setTotal(total).limit);

  res.json({ success: true, members, pagination: setTotal(total) });
});

export const getAllTeamMembers = asyncHandler(async (_req, res) => {
  const members = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, members });
});

export const getTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }
  res.json({ success: true, member });
});

export const createTeamMember = asyncHandler(async (req, res) => {
  const { name, position } = req.body;
  if (!name || !position) {
    return res.status(400).json({ success: false, message: 'Name and position are required' });
  }

  const member = await TeamMember.create(req.body);
  res.status(201).json({ success: true, member });
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }
  res.json({ success: true, member });
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByIdAndDelete(req.params.id);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }
  res.json({ success: true, message: 'Team member deleted successfully' });
});
