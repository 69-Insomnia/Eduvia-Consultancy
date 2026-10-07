import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import auth from '../middleware/auth';
import publicCache from '../middleware/publicCache';

const router = Router();

// Fetched on every page load and edited rarely, so it can sit at the edge
// longer than the content lists.
router.get('/', publicCache(300), getSettings);
router.put('/', auth, updateSettings);

export default router;
