import Destination from '../models/Destination';
import University from '../models/University';
import Blog from '../models/Blog';

// Read lazily rather than at module scope: ESM hoists imports, so this module is
// evaluated before server.js calls dotenv.config(), and a module-level read
// would always miss SITE_URL from .env.
const siteUrl = () => (process.env.SITE_URL || 'https://eduviaconsultancy.com').replace(/\/+$/, '');

const CACHE_TTL_MS = 60 * 60 * 1000;
let cache = null;

/**
 * Static routes, mirroring the route table in frontend/src/App.jsx.
 *
 * Only paths that actually exist there belong here: the SPA's catch-all
 * redirects unknown URLs to '/', so a stale entry would be a soft-404 that
 * search engines see as a duplicate of the homepage.
 */
const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/study-abroad', changefreq: 'weekly', priority: '0.9' },
  { path: '/universities', changefreq: 'daily', priority: '0.9' },
  { path: '/student-visa', changefreq: 'weekly', priority: '0.9' },
  { path: '/services', changefreq: 'monthly', priority: '0.8' },
  { path: '/scholarships', changefreq: 'weekly', priority: '0.8' },
  { path: '/blogs', changefreq: 'daily', priority: '0.7' },
  { path: '/test-preparation', changefreq: 'monthly', priority: '0.7' },
  { path: '/course-finder', changefreq: 'weekly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/success-stories', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/team', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.2' },
  { path: '/terms-conditions', changefreq: 'yearly', priority: '0.2' },
  { path: '/disclaimer', changefreq: 'yearly', priority: '0.2' },
];

// /test-preparation/:slug and /student-visa/:slug render from constants baked
// into the frontend rather than the database, so there is no collection to read
// them from. These lists mirror frontend/src/pages/TestPreparation.jsx (TEST
// slugs) and the VISA_DATA keys in VisaDetail.jsx — if those change, this needs
// the same edit.
//
// Only australia and canada are listed under /student-visa: VisaDetail's
// VISA_DATA covers just those two, and any other slug renders its "not found"
// state, which is a soft-404.
const STATIC_DYNAMIC_ROUTES = [
  { path: '/test-preparation/ielts', changefreq: 'monthly', priority: '0.7' },
  { path: '/test-preparation/pte', changefreq: 'monthly', priority: '0.7' },
  { path: '/test-preparation/toefl', changefreq: 'monthly', priority: '0.7' },
  { path: '/test-preparation/gre', changefreq: 'monthly', priority: '0.7' },
  { path: '/test-preparation/gmat', changefreq: 'monthly', priority: '0.7' },
  { path: '/test-preparation/sat', changefreq: 'monthly', priority: '0.7' },
  { path: '/test-preparation/duolingo', changefreq: 'monthly', priority: '0.7' },
  { path: '/student-visa/australia', changefreq: 'monthly', priority: '0.8' },
  { path: '/student-visa/canada', changefreq: 'monthly', priority: '0.8' },
];

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[char]);
}

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

/**
 * A document is excluded when its authored `robots` contains `noindex`.
 * Evaluated in JS rather than as a Mongo query so the rule lives in one place
 * and does not depend on how the string is punctuated.
 */
function isIndexable(doc) {
  return !/noindex/i.test(doc?.seo?.robots || '');
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  const parts = [`<loc>${escapeXml(loc)}</loc>`];
  if (lastmod) parts.push(`<lastmod>${lastmod}</lastmod>`);
  if (changefreq) parts.push(`<changefreq>${changefreq}</changefreq>`);
  if (priority) parts.push(`<priority>${priority}</priority>`);
  return `<url>${parts.join('')}</url>`;
}

/**
 * Builds the sitemap. The per-collection filters mirror each public list
 * endpoint's own filters exactly, so the sitemap never advertises a URL the
 * API would 404.
 */
export async function buildSitemap() {
  const base = siteUrl();

  const [destinations, universities, blogs] = await Promise.all([
    Destination.findAll({ where: { isActive: true }, attributes: ['id', 'slug', 'updatedAt', 'seo'] }),
    University.findAll({ where: { isActive: true }, attributes: ['id', 'slug', 'updatedAt', 'seo'] }),
    Blog.findAll({ where: { isPublished: true }, attributes: ['id', 'slug', 'publishedAt', 'updatedAt', 'seo'] }),
  ]);

  const entries = [
    ...STATIC_ROUTES.map((route) => ({ loc: `${base}${route.path}`, changefreq: route.changefreq, priority: route.priority })),
    ...STATIC_DYNAMIC_ROUTES.map((route) => ({ loc: `${base}${route.path}`, changefreq: route.changefreq, priority: route.priority })),
    ...destinations.filter(isIndexable).map((doc) => ({
      loc: `${base}/study-in/${doc.slug}`,
      lastmod: toDate(doc.updatedAt),
      changefreq: 'weekly',
      priority: '0.8',
    })),
    ...universities.filter(isIndexable).map((doc) => ({
      loc: `${base}/universities/${doc.slug}`,
      lastmod: toDate(doc.updatedAt),
      changefreq: 'weekly',
      priority: '0.7',
    })),
    ...blogs.filter(isIndexable).map((doc) => ({
      loc: `${base}/blogs/${doc.slug}`,
      lastmod: toDate(doc.publishedAt || doc.updatedAt),
      changefreq: 'weekly',
      priority: '0.6',
    })),
  ].filter((entry) => !entry.loc.endsWith('undefined'));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(urlEntry),
    '</urlset>',
  ].join('\n');
}

/**
 * Cached so a crawler hitting the unthrottled root route does not trigger three
 * collection scans per request. A stale hour is acceptable for a sitemap.
 */
export async function getSitemap() {
  const now = Date.now();
  if (cache && cache.expires > now) return cache.xml;

  const xml = await buildSitemap();
  cache = { xml, expires: now + CACHE_TTL_MS };
  return xml;
}

/** Exposed for tests and for a future admin "rebuild sitemap" action. */
export function clearSitemapCache() {
  cache = null;
}

export { siteUrl };
