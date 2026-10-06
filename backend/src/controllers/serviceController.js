import Service from '../models/Service.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { cleanBody } from '../utils/shape.js';

export const getServices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  const { skip, setTotal } = paginate(page, limit);
  const total = await Service.count({ where: filter });
  const services = await Service.findAll({
    where: filter,
    order: [
      ['order', 'ASC'],
      ['createdAt', 'ASC'],
    ],
    offset: skip,
    limit: setTotal(total).limit,
  });

  res.json({ success: true, services, pagination: setTotal(total) });
});

export const getAllServices = asyncHandler(async (_req, res) => {
  const services = await Service.findAll({
    order: [
      ['order', 'ASC'],
      ['createdAt', 'ASC'],
    ],
  });
  res.json({ success: true, services });
});

export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, service });
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ where: { slug: req.params.slug, isActive: true } });
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

  const service = await Service.create(cleanBody(req.body));
  res.status(201).json({ success: true, service });
});

export const updateService = asyncHandler(async (req, res) => {
  // save() rather than update(): the beforeUpdate hook regenerates the slug
  // when the title changes, and a bulk update skips hooks entirely.
  const service = await Service.findByPk(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  service.set(cleanBody(req.body));
  await service.save();
  res.json({ success: true, service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  await service.destroy();
  res.json({ success: true, message: 'Service deleted successfully' });
});
