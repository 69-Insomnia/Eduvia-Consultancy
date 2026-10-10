import SeoMeta from '../models/SeoMeta';
import asyncHandler from '../middleware/asyncHandler';
import { purgePaths } from '../utils/revalidate';

/**
 * Public read for one entity's custom SEO row. The site calls this to render
 * extra JSON-LD (and the meta overrides) on top of what the record itself
 * stores. Missing rows are a normal response, not an error.
 */
export const getEntitySeoMeta = asyncHandler(async (req, res) => {
  const entityType = String(req.params.entityType || '').trim().toLowerCase();
  const entityId = String(req.params.entityId || '').trim();
  if (!entityType || !entityId) {
    return res.status(400).json({ success: false, message: 'entityType and entityId are required' });
  }

  const row = await SeoMeta.findOne({ where: { entityType, entityId } });
  res.json({ success: true, seoMeta: row || null });
});

/**
 * Public read for every custom row of one entity type (e.g. all `service`
 * rows), so a listing page can attach per-item JSON-LD in a single request.
 */
export const getSeoMetaByType = asyncHandler(async (req, res) => {
  const entityType = String(req.params.entityType || '').trim().toLowerCase();
  if (!entityType) {
    return res.status(400).json({ success: false, message: 'entityType is required' });
  }

  const rows = await SeoMeta.findAll({ where: { entityType } });
  res.json({ success: true, seoMetas: rows });
});

/** Admin list: every custom-SEO row, newest edit first. */
export const listSeoMeta = asyncHandler(async (_req, res) => {
  const rows = await SeoMeta.findAll({ order: [['updatedAt', 'DESC']] });
  res.json({ success: true, seoMetas: rows });
});

/**
 * Admin upsert by (entityType, entityId). Replaces the row wholesale so the
 * editor can clear a field and drop back to the record's own defaults.
 */
export const upsertSeoMeta = asyncHandler(async (req, res) => {
  const entityType = String(req.params.entityType || req.body?.entityType || '').trim().toLowerCase();
  const entityId = String(req.params.entityId || req.body?.entityId || '').trim();
  if (!entityType || !entityId) {
    return res.status(400).json({ success: false, message: 'entityType and entityId are required' });
  }

  const {
    metaTitle,
    metaDescription,
    ogImageUrl,
    ogTitle,
    ogDescription,
    canonicalUrl,
    noindex,
    jsonLd,
  } = req.body || {};

  let row = await SeoMeta.findOne({ where: { entityType, entityId } });
  if (!row) {
    row = await SeoMeta.create({ entityType, entityId });
  }

  row.metaTitle = metaTitle ?? null;
  row.metaDescription = metaDescription ?? null;
  row.ogImageUrl = ogImageUrl ?? null;
  row.ogTitle = ogTitle ?? null;
  row.ogDescription = ogDescription ?? null;
  row.canonicalUrl = canonicalUrl ?? null;
  row.noindex = Boolean(noindex);
  row.jsonLd = jsonLd ?? null;
  await row.save();

  // The extra JSON-LD and meta tags ship with the page's HTML, so purge the
  // entity's public paths the same way the other SEO writers do.
  await purgePaths(res, seoMetaPaths(entityType, entityId));

  res.json({ success: true, seoMeta: row });
});

export const deleteSeoMeta = asyncHandler(async (req, res) => {
  const row = await SeoMeta.findByPk(req.params.id);
  if (!row) {
    return res.status(404).json({ success: false, message: 'SEO meta not found' });
  }
  await row.destroy();
  await purgePaths(res, seoMetaPaths(row.entityType, row.entityId));
  res.json({ success: true, message: 'SEO meta deleted' });
});

/** Map an entity reference to the public paths whose HTML embeds its SEO. */
function seoMetaPaths(entityType: string, entityId: string): string[] {
  switch (entityType) {
    case 'service':
      return ['/services'];
    case 'university':
      return ['/universities', `/universities/${entityId}`];
    case 'blog':
      return ['/blogs', `/blogs/${entityId}`];
    case 'destination':
      return ['/study-in', `/study-in/${entityId}`, `/student-visa/${entityId}`];
    case 'course':
      return ['/course-finder'];
    case 'scholarship':
      return ['/scholarships'];
    default:
      return [];
  }
}
