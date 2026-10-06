import SuccessStory from '../models/SuccessStory.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { cleanBody } from '../utils/shape.js';

export const getSuccessStories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isFeatured } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

  const { skip, setTotal } = paginate(page, limit);
  const total = await SuccessStory.count({ where: filter });
  const stories = await SuccessStory.findAll({
    where: filter,
    order: [['isFeatured', 'DESC'], ['createdAt', 'DESC NULLS LAST']],
    offset: skip,
    limit: setTotal(total).limit,
  });

  res.json({ success: true, stories, pagination: setTotal(total) });
});

export const getFeaturedSuccessStories = asyncHandler(async (_req, res) => {
  const stories = await SuccessStory.findAll({
    where: { isFeatured: true, isActive: true },
    order: [['createdAt', 'DESC NULLS LAST']],
    limit: 10,
  });
  res.json({ success: true, stories });
});

export const getSuccessStory = asyncHandler(async (req, res) => {
  const story = await SuccessStory.findByPk(req.params.id);
  if (!story) {
    return res.status(404).json({ success: false, message: 'Success story not found' });
  }
  res.json({ success: true, story });
});

export const createSuccessStory = asyncHandler(async (req, res) => {
  const { studentName, testimonial } = req.body;
  if (!studentName || !testimonial) {
    return res.status(400).json({ success: false, message: 'Student name and testimonial are required' });
  }

  const story = await SuccessStory.create(cleanBody(req.body));
  res.status(201).json({ success: true, story });
});

export const updateSuccessStory = asyncHandler(async (req, res) => {
  const story = await SuccessStory.findByPk(req.params.id);
  if (!story) {
    return res.status(404).json({ success: false, message: 'Success story not found' });
  }
  story.set(cleanBody(req.body));
  await story.save();
  res.json({ success: true, story });
});

export const deleteSuccessStory = asyncHandler(async (req, res) => {
  const story = await SuccessStory.findByPk(req.params.id);
  if (!story) {
    return res.status(404).json({ success: false, message: 'Success story not found' });
  }
  await story.destroy();
  res.json({ success: true, message: 'Success story deleted successfully' });
});
