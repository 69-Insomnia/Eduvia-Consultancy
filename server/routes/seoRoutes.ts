import { Router } from 'express';
import { getSitemapXml } from '../controllers/seoController';

const router = Router();

// Mounted at the app root, ahead of the SPA's catch-all 404.
router.get('/sitemap.xml', getSitemapXml);

export default router;
