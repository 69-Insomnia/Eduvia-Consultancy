import { Router } from 'express';
import {
  getUniversities,
  getFeaturedUniversities,
  getUniversityBySlug,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from '../controllers/universityController';
import auth from '../middleware/auth';
import optionalAuth from '../middleware/optionalAuth';
import publicCache from '../middleware/publicCache';

const router = Router();

router.get('/featured', publicCache(60), getFeaturedUniversities);
// optionalAuth so a signed-in admin sees deactivated records; anonymous
// callers still get active-only. publicCache sits after it so admin responses
// are marked uncacheable rather than shared.
router.get('/', optionalAuth, publicCache(60), getUniversities);
router.get('/:slug', publicCache(60), getUniversityBySlug);

router.post('/', auth, createUniversity);
router.put('/:id', auth, updateUniversity);
router.delete('/:id', auth, deleteUniversity);

export default router;
