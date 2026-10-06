import { Op } from 'sequelize';
import Scholarship from '../models/Scholarship.js';
import University from '../models/University.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { iLike } from '../utils/search.js';
import { cleanBody, takeRef } from '../utils/shape.js';

// Mongoose cast body relations (raw id, populated doc or `''`) to an ObjectId; unwrap them to the id here.
const refId = (v) => (v && typeof v === 'object' ? v._id ?? v.id ?? null : v === '' ? null : v);

const scholarshipBody = (body) => {
  const data = takeRef(cleanBody(body), 'university');
  if (data.universityId !== undefined) data.universityId = refId(data.universityId);
  return data;
};

const universityInclude = (attributes) => ({ model: University, as: 'university', attributes });

export const getScholarships = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, country, type, isFeatured } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  if (country) filter.country = country;
  if (type) filter.type = type;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
  if (search) {
    filter[Op.or] = [
      { name: iLike(search) },
      { country: iLike(search) },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Scholarship.count({ where: filter });
  const scholarships = await Scholarship.findAll({
    where: filter,
    order: [
      ['isFeatured', 'DESC'],
      ['deadline', 'ASC NULLS FIRST'],
    ],
    offset: skip,
    limit: setTotal(total).limit,
    include: [universityInclude(['id', 'name', 'country', 'city', 'logo'])],
  });

  res.json({ success: true, scholarships, pagination: setTotal(total) });
});

export const getScholarshipBySlug = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findOne({
    where: { slug: req.params.slug, isActive: true },
    include: [universityInclude(['id', 'name', 'country', 'city', 'logo', 'slug'])],
  });
  if (!scholarship) {
    return res.status(404).json({ success: false, message: 'Scholarship not found' });
  }
  res.json({ success: true, scholarship });
});

export const getScholarshipById = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findByPk(req.params.id, {
    include: [universityInclude(['id', 'name', 'country'])],
  });
  if (!scholarship) {
    return res.status(404).json({ success: false, message: 'Scholarship not found' });
  }
  res.json({ success: true, scholarship });
});

export const createScholarship = asyncHandler(async (req, res) => {
  const { name, country } = req.body;
  if (!name || !country) {
    return res.status(400).json({ success: false, message: 'Name and country are required' });
  }

  const scholarship = await Scholarship.create(scholarshipBody(req.body));
  res.status(201).json({ success: true, scholarship });
});

export const updateScholarship = asyncHandler(async (req, res) => {
  // save() rather than update(): the beforeUpdate hook regenerates the slug
  // when the name changes, and a bulk update skips hooks entirely.
  const scholarship = await Scholarship.findByPk(req.params.id);
  if (!scholarship) {
    return res.status(404).json({ success: false, message: 'Scholarship not found' });
  }
  scholarship.set(scholarshipBody(req.body));
  await scholarship.save();
  res.json({ success: true, scholarship });
});

export const deleteScholarship = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findByPk(req.params.id);
  if (!scholarship) {
    return res.status(404).json({ success: false, message: 'Scholarship not found' });
  }
  await scholarship.destroy();
  res.json({ success: true, message: 'Scholarship deleted successfully' });
});
