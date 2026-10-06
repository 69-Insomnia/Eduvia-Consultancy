import asyncHandler from '../middleware/asyncHandler';
import { getSitemap } from '../services/sitemapService';

/**
 * Serves /sitemap.xml. Mounted at the root rather than under /api so crawlers
 * are not subject to the API rate limiter, and so the URL matches the one
 * already advertised in the frontend's robots.txt.
 */
export const getSitemapXml = asyncHandler(async (_req, res) => {
  const xml = await getSitemap();
  res.type('application/xml');
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(xml);
});
