import Destination from '../models/Destination.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const getDestinations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await Destination.countDocuments(filter);
  const destinations = await Destination.find(filter)
    .sort({ isFeatured: -1, name: 1 })
    .skip(skip)
    .limit(setTotal(total).limit);

  res.json({ success: true, destinations, pagination: setTotal(total) });
});

export const getFeaturedDestinations = asyncHandler(async (_req, res) => {
  const destinations = await Destination.find({ isFeatured: true, isActive: true })
    .sort({ name: 1 })
    .limit(12);
  res.json({ success: true, destinations });
});

export const getDestinationBySlug = asyncHandler(async (req, res) => {
  const destination = await Destination.findOne({ slug: req.params.slug, isActive: true }).populate(
    'relatedBlogs',
    'title slug featuredImage excerpt'
  );
  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  res.json({ success: true, destination });
});

export const getDestinationById = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  res.json({ success: true, destination });
});

export const createDestination = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Destination name is required' });
  }

  const existing = await Destination.findOne({ name });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Destination with this name already exists' });
  }

  const destination = await Destination.create(req.body);
  res.status(201).json({ success: true, destination });
});

export const updateDestination = asyncHandler(async (req, res) => {
  // save() rather than findByIdAndUpdate: the pre-save hook regenerates the slug
  // when the name changes, and findByIdAndUpdate skips hooks entirely.
  const destination = await Destination.findById(req.params.id);
  if (destination) {
    const { _id, ...updates } = req.body;
    Object.assign(destination, updates);
    await destination.save();
  }
  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  res.json({ success: true, destination });
});

export const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findByIdAndDelete(req.params.id);
  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  res.json({ success: true, message: 'Destination deleted successfully' });
});
