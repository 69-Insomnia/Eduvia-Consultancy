import Service from '../models/Service.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const getServices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  const { skip, setTotal } = paginate(page, limit);
  const total = await Service.countDocuments(filter);
  const services = await Service.find(filter)
    .sort({ order: 1, createdAt: 1 })
    .skip(skip)
    .limit(setTotal(total).limit);

  res.json({ success: true, services, pagination: setTotal(total) });
});

export const getAllServices = asyncHandler(async (_req, res) => {
  const services = await Service.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, services });
});

export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, service });
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true });
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, service });
});

export const createService = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Service title is required' });
  }

  const service = await Service.create(req.body);
  res.status(201).json({ success: true, service });
});

export const updateService = asyncHandler(async (req, res) => {
  // save() rather than findByIdAndUpdate: the pre-save hook regenerates the slug
  // when the title changes, and findByIdAndUpdate skips hooks entirely.
  const service = await Service.findById(req.params.id);
  if (service) {
    const { _id, ...updates } = req.body;
    Object.assign(service, updates);
    await service.save();
  }
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, message: 'Service deleted successfully' });
});
