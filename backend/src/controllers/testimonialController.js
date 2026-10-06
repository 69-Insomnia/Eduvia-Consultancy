import Testimonial from '../models/Testimonial.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { cleanBody } from '../utils/shape.js';

export const getTestimonials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isFeatured } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

  const { skip, setTotal } = paginate(page, limit);
  const total = await Testimonial.count({ where: filter });
  const testimonials = await Testimonial.findAll({
    where: filter,
    order: [['isFeatured', 'DESC'], ['createdAt', 'DESC NULLS LAST']],
    offset: skip,
    limit: setTotal(total).limit,
  });

  res.json({ success: true, testimonials, pagination: setTotal(total) });
});

export const getFeaturedTestimonials = asyncHandler(async (_req, res) => {
  const testimonials = await Testimonial.findAll({
    where: { isFeatured: true, isActive: true },
    order: [['createdAt', 'DESC NULLS LAST']],
    limit: 10,
  });
  res.json({ success: true, testimonials });
});

export const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByPk(req.params.id);
  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }
  res.json({ success: true, testimonial });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const { studentName, quote } = req.body;
  if (!studentName || !quote) {
    return res.status(400).json({ success: false, message: 'Student name and quote are required' });
  }

  const testimonial = await Testimonial.create(cleanBody(req.body));
  res.status(201).json({ success: true, testimonial });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByPk(req.params.id);
  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }
  testimonial.set(cleanBody(req.body));
  await testimonial.save();
  res.json({ success: true, testimonial });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByPk(req.params.id);
  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }
  await testimonial.destroy();
  res.json({ success: true, message: 'Testimonial deleted successfully' });
});
