import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import auth from '../middleware/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', auth, updateSettings);

export default router;
