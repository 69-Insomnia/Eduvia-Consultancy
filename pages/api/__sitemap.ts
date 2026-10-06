import type { NextApiRequest, NextApiResponse } from 'next';
import app from '../../server/app';

// /sitemap.xml is served by the Express app (seoRoutes) so the XML, its
// 1-hour cache header and the noindex filtering stay identical. Reachable
// via the next.config rewrite `/sitemap.xml` -> `/api/__sitemap`; the URL is
// normalised here so Express always sees the original path.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  req.url = '/sitemap.xml';
  app(req as any, res as any);
}
