import University from '../models/University.js';
import Course from '../models/Course.js';
import Destination from '../models/Destination.js';
import Scholarship from '../models/Scholarship.js';
import Service from '../models/Service.js';
import Blog from '../models/Blog.js';
import PageSeo from '../models/PageSeo.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { PAGES } from '../config/pages.js';
import { getSitemap } from '../services/sitemapService.js';

const TITLE_MAX = 60;
const TITLE_MIN = 20;
const DESCRIPTION_MAX = 160;

/**
 * Only entities that are actually public are audited. A draft blog or an
 * inactive university cannot rank, so reporting it as "missing SEO" would be
 * noise that trains the editor to ignore the panel.
 */
const TARGETS = [
  { label: 'Universities', model: University, filter: { isActive: true }, url: (d) => `/universities/${d.slug}` },
  { label: 'Courses', model: Course, filter: { isActive: true }, url: () => null },
  { label: 'Destinations', model: Destination, filter: { isActive: true }, url: (d) => `/study-in/${d.slug}` },
  { label: 'Scholarships', model: Scholarship, filter: { isActive: true }, url: () => null },
  { label: 'Services', model: Service, filter: { isActive: true }, url: () => null },
  { label: 'Blogs', model: Blog, filter: { isPublished: true }, url: (d) => `/blogs/${d.slug}` },
];

const count = (match) => [{ $match: match }, { $count: 'n' }];
const pluck = (result) => result?.[0]?.n || 0;

/** Matches a field that is absent, null or an empty string. */
const missing = (path) => ({ $or: [{ [path]: { $exists: false } }, { [path]: null }, { [path]: '' }] });

/**
 * One aggregation per collection rather than shipping every document to the
 * browser to count there. `$facet` lets all the counts share a single scan.
 */
async function auditModel({ model, filter }) {
  const stringTitle = { $type: 'string', $ne: '' };
  const titleLength = { $strLenCP: { $ifNull: ['$seo.title', ''] } };
  const descriptionLength = { $strLenCP: { $ifNull: ['$seo.description', ''] } };

  const [facets] = await model.aggregate([
    { $match: filter },
    {
      $facet: {
        total: [{ $count: 'n' }],
        missingSeo: count(missing('seo.title')),
        titleLong: count({ $expr: { $gt: [titleLength, TITLE_MAX] } }),
        titleShort: count({
          $and: [{ 'seo.title': stringTitle }, { $expr: { $lt: [titleLength, TITLE_MIN] } }],
        }),
        descriptionMissing: count(missing('seo.description')),
        descriptionLong: count({ $expr: { $gt: [descriptionLength, DESCRIPTION_MAX] } }),
        noindex: count({ 'seo.robots': /noindex/i }),
      },
    },
  ]);

  return {
    total: pluck(facets.total),
    missingSeo: pluck(facets.missingSeo),
    titleLong: pluck(facets.titleLong),
    titleShort: pluck(facets.titleShort),
    descriptionMissing: pluck(facets.descriptionMissing),
    descriptionLong: pluck(facets.descriptionLong),
    noindex: pluck(facets.noindex),
  };
}

/**
 * Titles reused across documents. Distinct pages competing on an identical
 * title is a real ranking problem and one of the few things an editor cannot
 * spot by opening records one at a time.
 */
async function findDuplicateTitles() {
  const seen = new Map();

  await Promise.all(
    TARGETS.map(async ({ label, model, filter }) => {
      const rows = await model.aggregate([
        { $match: { ...filter, 'seo.title': { $type: 'string', $ne: '' } } },
        { $group: { _id: '$seo.title', count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
      ]);

      for (const row of rows) {
        const entry = seen.get(row._id) || { title: row._id, count: 0, where: [] };
        entry.count += row.count;
        entry.where.push(label);
        seen.set(row._id, entry);
      }
    })
  );

  return [...seen.values()].sort((a, b) => b.count - a.count);
}

export const getSeoStats = asyncHandler(async (_req, res) => {
  const [audits, pageRows, duplicateTitles] = await Promise.all([
    Promise.all(TARGETS.map(({ model, filter }) => auditModel({ model, filter }))),
    PageSeo.find().select('key seo').lean(),
    findDuplicateTitles(),
  ]);

  const entities = TARGETS.map((target, index) => ({ label: target.label, ...audits[index] }));

  const pageSeoByKey = new Map(pageRows.map((row) => [row.key, row.seo || {}]));
  const pages = PAGES.map((page) => {
    const seo = pageSeoByKey.get(page.key) || {};
    return {
      key: page.key,
      label: page.label,
      path: page.path,
      isCustom: Boolean(seo.title),
      isNoindex: /noindex/i.test(seo.robots || ''),
      titleLength: (seo.title || '').length,
      titleLong: (seo.title || '').length > TITLE_MAX,
      descriptionMissing: !seo.description,
    };
  });

  const totals = entities.reduce(
    (acc, row) => ({
      documents: acc.documents + row.total,
      missingSeo: acc.missingSeo + row.missingSeo,
      titleLong: acc.titleLong + row.titleLong,
      titleShort: acc.titleShort + row.titleShort,
      descriptionMissing: acc.descriptionMissing + row.descriptionMissing,
      descriptionLong: acc.descriptionLong + row.descriptionLong,
      noindex: acc.noindex + row.noindex,
    }),
    { documents: 0, missingSeo: 0, titleLong: 0, titleShort: 0, descriptionMissing: 0, descriptionLong: 0, noindex: 0 }
  );

  // Counted from the real sitemap so the number can never drift from what is
  // actually being served.
  let sitemapUrlCount = null;
  try {
    const xml = await getSitemap();
    sitemapUrlCount = (xml.match(/<loc>/g) || []).length;
  } catch {
    sitemapUrlCount = null;
  }

  res.json({
    success: true,
    limits: { titleMax: TITLE_MAX, titleMin: TITLE_MIN, descriptionMax: DESCRIPTION_MAX },
    totals: {
      ...totals,
      pages: pages.length,
      pagesCustom: pages.filter((p) => p.isCustom).length,
      pagesUsingDefault: pages.filter((p) => !p.isCustom).length,
      sitemapUrlCount,
    },
    entities,
    pages,
    duplicateTitles,
  });
});
