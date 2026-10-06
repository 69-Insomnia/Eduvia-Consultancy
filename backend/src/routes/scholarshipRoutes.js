import { Router } from 'express';
import {
  getScholarships,
  getScholarshipBySlug,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} from '../controllers/scholarshipController.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';

const router = Router();

router.get('/', optionalAuth, getScholarships);
router.get('/:slug', getScholarshipBySlug);

router.post('/', auth, createScholarship);
router.put('/:id', auth, updateScholarship);
router.delete('/:id', auth, deleteScholarship);

export default router;
