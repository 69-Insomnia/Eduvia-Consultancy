import ContactMessage from '../models/ContactMessage.js';
import asyncHandler from '../middleware/asyncHandler.js';
import paginate from '../utils/pagination.js';

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }

  const contact = await ContactMessage.create(req.body);
  res.status(201).json({ success: true, contact, message: 'Your message has been sent successfully' });
});

export const getContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, isRead } = req.query;

  const filter = {};
  if (isRead !== undefined) filter.isRead = isRead === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
  }

  const { skip, setTotal } = paginate(page, limit);
  const total = await ContactMessage.countDocuments(filter);
  const contacts = await ContactMessage.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(setTotal(total).limit);

  res.json({ success: true, contacts, pagination: setTotal(total) });
});

export const markRead = asyncHandler(async (req, res) => {
  const contact = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Contact message not found' });
  }
  res.json({ success: true, contact });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Contact message not found' });
  }
  res.json({ success: true, message: 'Contact message deleted' });
});
