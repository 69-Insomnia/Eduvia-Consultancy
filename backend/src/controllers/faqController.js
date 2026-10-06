import FAQ from '../models/FAQ.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { cleanBody } from '../utils/shape.js';

export const getFAQs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;

  const filter = req.admin ? {} : { isActive: true };
  if (category) filter.category = category;

  const { skip, setTotal } = paginate(page, limit);
  const total = await FAQ.count({ where: filter });
  const faqs = await FAQ.findAll({
    where: filter,
    order: [['order', 'ASC'], ['createdAt', 'ASC']],
    offset: skip,
    limit: setTotal(total).limit,
  });

  res.json({ success: true, faqs, pagination: setTotal(total) });
});

export const getAllFAQs = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = category;

  const faqs = await FAQ.findAll({
    where: filter,
    order: [['order', 'ASC'], ['createdAt', 'ASC']],
  });
  res.json({ success: true, faqs });
});

export const getFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByPk(req.params.id);
  if (!faq) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }
  res.json({ success: true, faq });
});

export const createFAQ = asyncHandler(async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'Question and answer are required' });
  }

  const faq = await FAQ.create(cleanBody(req.body));
  res.status(201).json({ success: true, faq });
});

export const updateFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByPk(req.params.id);
  if (!faq) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }
  faq.set(cleanBody(req.body));
  await faq.save();
  res.json({ success: true, faq });
});

export const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByPk(req.params.id);
  if (!faq) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }
  await faq.destroy();
  res.json({ success: true, message: 'FAQ deleted successfully' });
});
