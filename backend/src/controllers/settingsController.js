import SiteSettings from '../models/SiteSettings.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await SiteSettings.getSettings();
  res.json({ success: true, settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings({});
  }

  const allowedFields = ['company', 'contact', 'socialMedia', 'officeHours', 'statistics', 'heroSettings', 'seo', 'footerSettings'];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      if (typeof req.body[field] === 'object' && !Array.isArray(req.body[field])) {
        settings[field] = { ...settings[field].toObject(), ...req.body[field] };
      } else {
        settings[field] = req.body[field];
      }
    }
  }

  await settings.save();
  res.json({ success: true, settings });
});
