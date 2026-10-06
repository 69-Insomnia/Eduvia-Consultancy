import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
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
  { label: 'Universities', model: University, whereSql: 'is_active = true', url: (d) => `/universities/${d.slug}` },
  { label: 'Courses', model: Course, whereSql: 'is_active = true', url: () => null },
  { label: 'Destinations', model: Destination, whereSql: 'is_active = true', url: (d) => `/study-in/${d.slug}` },
  { label: 'Scholarships', model: Scholarship, whereSql: 'is_active = true', url: () => null },
  { label: 'Services', model: Service, whereSql: 'is_active = true', url: () => null },
  { label: 'Blogs', model: Blog, whereSql: 'is_published = true', url: (d) => `/blogs/${d.slug}` },
];

/**
 * One aggregate scan per collection instead of shipping every document to the
 * browser. `FILTER` counts mirror the old `$facet` counts exactly: a missing
 * seo title is absent, null or an empty string.
 */
async function auditModel({ model, whereSql }) {
  const [row] = await sequelize.query(
    `SELECT
       count(*)::int AS total,
       count(*) FILTER (WHERE seo IS NULL OR seo->>'title' IS NULL OR seo->>'title' = '')::int AS "missingSeo",
       count(*) FILTER (WHERE length(coalesce(seo->>'title', '')) > ${TITLE_MAX})::int AS "titleLong",
       count(*) FILTER (WHERE seo->>'title' IS NOT NULL AND seo->>'title' <> '' AND length(seo->>'title') < ${TITLE_MIN})::int AS "titleShort",
       count(*) FILTER (WHERE seo IS NULL OR seo->>'description' IS NULL OR seo->>'description' = '')::int AS "descriptionMissing",
       count(*) FILTER (WHERE length(coalesce(seo->>'description', '')) > ${DESCRIPTION_MAX})::int AS "descriptionLong",
       count(*) FILTER (WHERE seo->>'robots' ~* 'noindex')::int AS noindex
     FROM "${model.tableName}"
     WHERE ${whereSql}`,
    { type: QueryTypes.SELECT }
  );

  return {
    total: row.total,
    missingSeo: row.missingSeo,
    titleLong: row.titleLong,
    titleShort: row.titleShort,
    descriptionMissing: row.descriptionMissing,
    descriptionLong: row.descriptionLong,
    noindex: row.noindex,
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
    TARGETS.map(async ({ label, model, whereSql }) => {
      const rows = await sequelize.query(
        `SELECT seo->>'title' AS title, count(*)::int AS count
         FROM "${model.tableName}"
         WHERE ${whereSql} AND seo->>'title' IS NOT NULL AND seo->>'title' <> ''
         GROUP BY 1
         HAVING count(*) > 1`,
        { type: QueryTypes.SELECT }
      );

      for (const row of rows) {
        const entry = seen.get(row.title) || { title: row.title, count: 0, where: [] };
        entry.count += row.count;
        entry.where.push(label);
        seen.set(row.title, entry);
      }
    })
  );

  return [...seen.values()].sort((a, b) => b.count - a.count);
}

export const getSeoStats = asyncHandler(async (_req, res) => {
  const [audits, pageRows, duplicateTitles] = await Promise.all([
    Promise.all(TARGETS.map((target) => auditModel(target))),
    PageSeo.findAll({ attributes: ['id', 'key', 'seo'] }),
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
