import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { getSeoStats } from '../controllers/seoStatsController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);
router.get('/stats', getDashboardStats);
router.get('/seo', getSeoStats);

export default router;
