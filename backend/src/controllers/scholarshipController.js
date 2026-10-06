import Scholarship from '../models/Scholarship.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const getScholarships = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, country, type, isFeatured } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  if (country) filter.country = country;
  if (type) filter.type = type;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { country: { $regex: search, $options: 'i' } },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Scholarship.countDocuments(filter);
  const scholarships = await Scholarship.find(filter)
    .sort({ isFeatured: -1, deadline: 1 })
    .skip(skip)
    .limit(setTotal(total).limit)
    .populate('university', 'name country city logo');

  res.json({ success: true, scholarships, pagination: setTotal(total) });
});

export const getScholarshipBySlug = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findOne({ slug: req.params.slug, isActive: true }).populate(
    'university',
    'name country city logo slug'
  );
  if (!scholarship) {
    return res.status(404).json({ success: false, message: 'Scholarship not found' });
  }
  res.json({ success: true, scholarship });
});

export const getScholarshipById = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findById(req.params.id).populate('university', 'name country');
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

  const scholarship = await Scholarship.create(req.body);
  res.status(201).json({ success: true, scholarship });
});

export const updateScholarship = asyncHandler(async (req, res) => {
  // save() rather than findByIdAndUpdate: the pre-save hook regenerates the slug
  // when the name changes, and findByIdAndUpdate skips hooks entirely.
  const scholarship = await Scholarship.findById(req.params.id);
  if (scholarship) {
    const { _id, ...updates } = req.body;
    Object.assign(scholarship, updates);
    await scholarship.save();
  }
  if (!scholarship) {
    return res.status(404).json({ success: false, message: 'Scholarship not found' });
  }
  res.json({ success: true, scholarship });
});

export const deleteScholarship = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
  if (!scholarship) {
    return res.status(404).json({ success: false, message: 'Scholarship not found' });
  }
  res.json({ success: true, message: 'Scholarship deleted successfully' });
});
