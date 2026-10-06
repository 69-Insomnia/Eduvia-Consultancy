import { Op } from 'sequelize';
import University from '../models/University.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { iLike } from '../utils/search.js';
import { cleanBody } from '../utils/shape.js';

export const getUniversities = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, country, type, isFeatured } = req.query;

  // An authenticated admin sees deactivated records too — otherwise deactivating
  // something would remove it from the admin entirely.
  const filter = req.admin ? {} : { isActive: true };
  if (country) filter.country = country;
  if (type) filter.type = type;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
  if (search) {
    filter[Op.or] = [
      { name: iLike(search) },
      { city: iLike(search) },
      { country: iLike(search) },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await University.count({ where: filter });
  const universities = await University.findAll({
    where: filter,
    order: [
      ['isFeatured', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    offset: skip,
    limit: setTotal(total).limit,
  });

  res.json({ success: true, universities, pagination: setTotal(total) });
});

export const getFeaturedUniversities = asyncHandler(async (_req, res) => {
  const universities = await University.findAll({
    where: { isFeatured: true, isActive: true },
    order: [['createdAt', 'DESC']],
    limit: 10,
  });
  res.json({ success: true, universities });
});

export const getUniversityBySlug = asyncHandler(async (req, res) => {
  const university = await University.findOne({ where: { slug: req.params.slug, isActive: true } });
  if (!university) {
    return res.status(404).json({ success: false, message: 'University not found' });
  }
  res.json({ success: true, university });
});

export const getUniversityById = asyncHandler(async (req, res) => {
  const university = await University.findByPk(req.params.id);
  if (!university) {
    return res.status(404).json({ success: false, message: 'University not found' });
  }
  res.json({ success: true, university });
});

export const createUniversity = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'University name is required' });
  }

  const existing = await University.findOne({ where: { name } });
  if (existing) {
    return res.status(400).json({ success: false, message: 'University with this name already exists' });
  }

  const university = await University.create(cleanBody(req.body));
  res.status(201).json({ success: true, university });
});

export const updateUniversity = asyncHandler(async (req, res) => {
  // save() rather than update(): the beforeUpdate hook regenerates the slug
  // when the name changes, and a bulk update skips hooks entirely.
  const university = await University.findByPk(req.params.id);
  if (!university) {
    return res.status(404).json({ success: false, message: 'University not found' });
  }
  university.set(cleanBody(req.body));
  await university.save();
  res.json({ success: true, university });
});

export const deleteUniversity = asyncHandler(async (req, res) => {
  const university = await University.findByPk(req.params.id);
  if (!university) {
    return res.status(404).json({ success: false, message: 'University not found' });
  }
  await university.destroy();
  res.json({ success: true, message: 'University deleted successfully' });
});
