import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { getSeoStats } from '../controllers/seoStatsController';
import auth from '../middleware/auth';

const router = Router();

router.use(auth);
router.get('/stats', getDashboardStats);
router.get('/seo', getSeoStats);

export default router;
