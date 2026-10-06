import University from '../models/University.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const getUniversities = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, country, type, isFeatured } = req.query;

  // An authenticated admin sees deactivated records too — otherwise deactivating
  // something would remove it from the admin entirely.
  const filter = req.admin ? {} : { isActive: true };
  if (country) filter.country = country;
  if (type) filter.type = type;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { country: { $regex: search, $options: 'i' } },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await University.countDocuments(filter);
  const universities = await University.find(filter)
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip(skip)
    .limit(setTotal(total).limit);

  res.json({ success: true, universities, pagination: setTotal(total) });
});

export const getFeaturedUniversities = asyncHandler(async (_req, res) => {
  const universities = await University.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(10);
  res.json({ success: true, universities });
});

export const getUniversityBySlug = asyncHandler(async (req, res) => {
  const university = await University.findOne({ slug: req.params.slug, isActive: true });
  if (!university) {
    return res.status(404).json({ success: false, message: 'University not found' });
  }
  res.json({ success: true, university });
});

export const getUniversityById = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
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

  const existing = await University.findOne({ name });
  if (existing) {
    return res.status(400).json({ success: false, message: 'University with this name already exists' });
  }

  const university = await University.create(req.body);
  res.status(201).json({ success: true, university });
});

export const updateUniversity = asyncHandler(async (req, res) => {
  // save() rather than findByIdAndUpdate: the pre-save hook regenerates the slug
  // when the name changes, and findByIdAndUpdate skips hooks entirely.
  const university = await University.findById(req.params.id);
  if (university) {
    const { _id, ...updates } = req.body;
    Object.assign(university, updates);
    await university.save();
  }
  if (!university) {
    return res.status(404).json({ success: false, message: 'University not found' });
  }
  res.json({ success: true, university });
});

export const deleteUniversity = asyncHandler(async (req, res) => {
  const university = await University.findByIdAndDelete(req.params.id);
  if (!university) {
    return res.status(404).json({ success: false, message: 'University not found' });
  }
  res.json({ success: true, message: 'University deleted successfully' });
});
