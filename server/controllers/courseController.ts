import { Op } from 'sequelize';
import Course from '../models/Course';
import University from '../models/University';
import asyncHandler from '../middleware/asyncHandler';
import paginate from '../utils/pagination';
import { iLike } from '../utils/search';
import { cleanBody } from '../utils/shape';

const UNI_SHORT = ['id', 'name', 'country', 'city', 'logo', 'slug'];
const UNI_SHORTER = ['id', 'name', 'country', 'city'];

const universitiesInclude = (attributes) => ({
  model: University,
  as: 'universities',
  attributes,
  through: { attributes: [] },
});

// Mongoose cast body relations (raw id, populated doc or `''`) to an ObjectId; unwrap them to the id here.
const refId = (v) => (v && typeof v === 'object' ? v._id ?? v.id ?? null : v === '' ? null : v);
const refIds = (v) => (v == null ? [] : (Array.isArray(v) ? v : [v]).map(refId));

export const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, degreeLevel, country, isFeatured } = req.query;

  const filter: any = req.admin ? {} : { isActive: true };
  if (category) filter.category = category;
  if (degreeLevel) filter.degreeLevel = degreeLevel;
  if (country) filter.countries = { [Op.contains]: [country] };
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
  if (search) {
    filter[Op.or] = [
      { name: iLike(search) },
      { category: iLike(search) },
      { description: iLike(search) },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Course.count({ where: filter });
  const courses = await Course.findAll({
    where: filter,
    order: [
      ['isFeatured', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    offset: skip,
    limit: setTotal(total).limit,
    include: [universitiesInclude(UNI_SHORT)],
  });

  res.json({ success: true, courses, pagination: setTotal(total) });
});

export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    where: { slug: req.params.slug, isActive: true },
    include: [universitiesInclude(UNI_SHORT)],
  });
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  res.json({ success: true, course });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [universitiesInclude(UNI_SHORTER)],
  });
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  res.json({ success: true, course });
});

export const createCourse = asyncHandler(async (req, res) => {
  const { name, degreeLevel } = req.body;
  if (!name || !degreeLevel) {
    return res.status(400).json({ success: false, message: 'Course name and degree level are required' });
  }

  const { universities, ...data } = cleanBody(req.body) as any;
  let course = await Course.create(data);
  if (universities !== undefined) {
    await course.setUniversities(refIds(universities));
  }
  course = await Course.findByPk(course.id, { include: [universitiesInclude(UNI_SHORT)] });
  res.status(201).json({ success: true, course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  // save() rather than update(): the beforeUpdate hook regenerates the slug
  // when the name changes, and a bulk update skips hooks entirely.
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  const { universities, ...updates } = cleanBody(req.body) as any;
  course.set(updates);
  await course.save();
  if (universities !== undefined) {
    await course.setUniversities(refIds(universities));
  }
  const reloaded = await Course.findByPk(course.id, { include: [universitiesInclude(UNI_SHORT)] });
  res.json({ success: true, course: reloaded });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  await course.destroy();
  res.json({ success: true, message: 'Course deleted successfully' });
});
