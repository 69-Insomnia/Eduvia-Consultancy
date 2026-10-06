import { Router } from 'express';
import {
  getTestimonials,
  getFeaturedTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';

const router = Router();

router.get('/featured', getFeaturedTestimonials);
router.get('/', optionalAuth, getTestimonials);

router.post('/', auth, createTestimonial);
router.get('/:id', auth, getTestimonial);
router.put('/:id', auth, updateTestimonial);
router.delete('/:id', auth, deleteTestimonial);

export default router;
