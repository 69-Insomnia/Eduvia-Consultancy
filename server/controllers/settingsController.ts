import SiteSettings from '../models/SiteSettings';
import asyncHandler from '../middleware/asyncHandler';
import { purgePaths } from '../utils/revalidate';

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await SiteSettings.getSettings();
  res.json({ success: true, settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = SiteSettings.build({});
  }

  const allowedFields = ['company', 'contact', 'socialMedia', 'officeHours', 'statistics', 'heroSettings', 'seo', 'footerSettings'];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      if (typeof req.body[field] === 'object' && !Array.isArray(req.body[field])) {
        // JSONB fields come back as plain objects, so a spread replaces the
        // same keys a Mongoose subdocument merge did.
        settings[field] = { ...(settings[field] || {}), ...req.body[field] };
      } else {
        settings[field] = req.body[field];
      }
    }
  }

  await settings.save();
  // Settings feed the root layout and the OG-image fallback on every page;
  // purge the home page so the change is visible at once.
  await purgePaths(res, ['/']);
  res.json({ success: true, settings });
});
