import { Op } from 'sequelize';
import ContactMessage from '../models/ContactMessage.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';
import { iLike } from '../utils/search.js';
import { cleanBody } from '../utils/shape.js';

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }

  const contact = await ContactMessage.create(cleanBody(req.body));
  res.status(201).json({ success: true, contact, message: 'Your message has been sent successfully' });
});

export const getContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, isRead } = req.query;

  const filter = {};
  if (isRead !== undefined) filter.isRead = isRead === 'true';
  if (search) {
    filter[Op.or] = [
      { name: iLike(search) },
      { email: iLike(search) },
      { subject: iLike(search) },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await ContactMessage.count({ where: filter });
  const contacts = await ContactMessage.findAll({
    where: filter,
    order: [['createdAt', 'DESC NULLS LAST']],
    offset: skip,
    limit: setTotal(total).limit,
  });

  res.json({ success: true, contacts, pagination: setTotal(total) });
});

export const markRead = asyncHandler(async (req, res) => {
  const contact = await ContactMessage.findByPk(req.params.id);
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Contact message not found' });
  }
  contact.set({ isRead: true });
  await contact.save();
  res.json({ success: true, contact });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await ContactMessage.findByPk(req.params.id);
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Contact message not found' });
  }
  await contact.destroy();
  res.json({ success: true, message: 'Contact message deleted' });
});
