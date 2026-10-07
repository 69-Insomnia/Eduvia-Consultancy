import { Router } from 'express';
import {
  getScholarships,
  getScholarshipBySlug,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} from '../controllers/scholarshipController';
import auth from '../middleware/auth';
import optionalAuth from '../middleware/optionalAuth';
import publicCache from '../middleware/publicCache';

const router = Router();

router.get('/', optionalAuth, publicCache(60), getScholarships);
router.get('/:slug', publicCache(60), getScholarshipBySlug);

router.post('/', auth, createScholarship);
router.put('/:id', auth, updateScholarship);
router.delete('/:id', auth, deleteScholarship);

export default router;
