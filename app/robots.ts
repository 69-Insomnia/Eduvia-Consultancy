import type { MetadataRoute } from 'next';
import { resolveSiteUrl } from '../utils/siteUrl';

/**
 * Replaces the former static public/robots.txt, which pinned the sitemap to the
 * production domain and so pointed a demo/preview deployment at the wrong host.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${resolveSiteUrl()}/sitemap.xml`,
  };
}
