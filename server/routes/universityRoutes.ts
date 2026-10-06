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
