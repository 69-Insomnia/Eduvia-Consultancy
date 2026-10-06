import Course from '../models/Course.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, degreeLevel, country, isFeatured } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  if (category) filter.category = category;
  if (degreeLevel) filter.degreeLevel = degreeLevel;
  if (country) filter.countries = { $in: [country] };
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Course.countDocuments(filter);
  const courses = await Course.find(filter)
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip(skip)
    .limit(setTotal(total).limit)
    .populate('universities', 'name country city logo slug');

  res.json({ success: true, courses, pagination: setTotal(total) });
});

export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, isActive: true }).populate(
    'universities',
    'name country city logo slug'
  );
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  res.json({ success: true, course });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('universities', 'name country city');
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

  const course = await Course.create(req.body);
  res.status(201).json({ success: true, course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  // save() rather than findByIdAndUpdate: the pre-save hook regenerates the slug
  // when the name changes, and findByIdAndUpdate skips hooks entirely.
  const course = await Course.findById(req.params.id);
  if (course) {
    const { _id, ...updates } = req.body;
    Object.assign(course, updates);
    await course.save();
  }
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  res.json({ success: true, course });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  res.json({ success: true, message: 'Course deleted successfully' });
});
