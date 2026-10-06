import TeamMember from '../models/TeamMember.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { cleanBody } from '../utils/shape.js';

export const getTeamMembers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  const { skip, setTotal } = paginate(page, limit);
  const total = await TeamMember.count({ where: filter });
  const members = await TeamMember.findAll({
    where: filter,
    order: [['order', 'ASC'], ['createdAt', 'ASC']],
    offset: skip,
    limit: setTotal(total).limit,
  });

  res.json({ success: true, members, pagination: setTotal(total) });
});

export const getAllTeamMembers = asyncHandler(async (_req, res) => {
  const members = await TeamMember.findAll({
    where: { isActive: true },
    order: [['order', 'ASC'], ['createdAt', 'ASC']],
  });
  res.json({ success: true, members });
});

export const getTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByPk(req.params.id);
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

  const member = await TeamMember.create(cleanBody(req.body));
  res.status(201).json({ success: true, member });
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByPk(req.params.id);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }
  member.set(cleanBody(req.body));
  await member.save();
  res.json({ success: true, member });
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByPk(req.params.id);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }
  await member.destroy();
  res.json({ success: true, message: 'Team member deleted successfully' });
});
