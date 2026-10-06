import PageSeo from '../models/PageSeo.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { PAGES, findPage } from '../config/pages.js';

/**
 * Public read. Returns only rows that exist, keyed by page key — a page with no
 * row simply falls back to the default compiled into the frontend.
 *
 * Deliberately read-only: this endpoint is unauthenticated, so it must not be
 * able to trigger a write.
 */
export const getPublicPageSeo = asyncHandler(async (_req, res) => {
  const rows = await PageSeo.find().select('key seo').lean();

  res.json({
    success: true,
    pages: rows.map((row) => ({ key: row.key, seo: row.seo || {} })),
  });
});

/**
 * Admin read. Returns every page in the registry, whether or not a row exists
 * yet, so the editor always sees the complete list rather than an empty table
 * on a fresh install.
 */
export const getAdminPageSeo = asyncHandler(async (_req, res) => {
  const rows = await PageSeo.find().lean();
  const byKey = new Map(rows.map((row) => [row.key, row]));

  // Backfill any page that has no row yet. Cheap, and it means the admin can
  // edit a page that was added to the registry after the last seed.
  const missing = PAGES.filter((page) => !byKey.has(page.key));
  if (missing.length) {
    const created = await PageSeo.insertMany(
      missing.map((page) => ({ key: page.key, label: page.label, path: page.path })),
      { ordered: false }
    ).catch(() => []);
    for (const row of created) byKey.set(row.key, row.toObject());
  }

  res.json({
    success: true,
    pages: PAGES.map((page) => ({
      key: page.key,
      label: page.label,
      path: page.path,
      seo: byKey.get(page.key)?.seo || {},
      updatedAt: byKey.get(page.key)?.updatedAt || null,
    })),
  });
});

/**
 * Admin write, by page key. Only the `seo` block is editable here.
 *
 * The block is replaced wholesale rather than merged, and that is deliberate:
 * the admin form always submits its complete state, and `seoToPayload` omits
 * empty fields — so a merge would make it impossible to *clear* a field and
 * fall back to the default, which is the main reason to edit here at all.
 */
export const updatePageSeo = asyncHandler(async (req, res) => {
  const { key } = req.params;

  if (!findPage(key)) {
    return res.status(400).json({ success: false, message: `Unknown page key: ${key}` });
  }

  const page = await PageSeo.findOneAndUpdate(
    { key },
    { $set: { seo: req.body?.seo ?? {} } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ success: true, page: { key: page.key, seo: page.seo } });
});

/**
 * Clears the override so the page returns to the default compiled into the
 * frontend. This is what makes the editor safe to experiment with.
 */
export const resetPageSeo = asyncHandler(async (req, res) => {
  const { key } = req.params;

  const page = await PageSeo.findOneAndUpdate({ key }, { $set: { seo: {} } }, { new: true });
  if (!page) {
    return res.status(404).json({ success: false, message: 'Page SEO not found' });
  }

  res.json({ success: true, page: { key: page.key, seo: page.seo } });
});
