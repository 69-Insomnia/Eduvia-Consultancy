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

const router = Router();

router.get('/', optionalAuth, getScholarships);
router.get('/:slug', getScholarshipBySlug);

router.post('/', auth, createScholarship);
router.put('/:id', auth, updateScholarship);
router.delete('/:id', auth, deleteScholarship);

export default router;
