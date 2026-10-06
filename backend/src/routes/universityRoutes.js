import { Router } from 'express';
import {
  getUniversities,
  getFeaturedUniversities,
  getUniversityBySlug,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from '../controllers/universityController.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';

const router = Router();

router.get('/featured', getFeaturedUniversities);
// optionalAuth so a signed-in admin sees deactivated records; anonymous
// callers still get active-only.
router.get('/', optionalAuth, getUniversities);
router.get('/:slug', getUniversityBySlug);

router.post('/', auth, createUniversity);
router.put('/:id', auth, updateUniversity);
router.delete('/:id', auth, deleteUniversity);

export default router;
