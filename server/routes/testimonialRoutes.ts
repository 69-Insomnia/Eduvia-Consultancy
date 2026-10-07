import { Router } from 'express';
import {
  getTestimonials,
  getFeaturedTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController';
import auth from '../middleware/auth';
import optionalAuth from '../middleware/optionalAuth';
import publicCache from '../middleware/publicCache';

const router = Router();

router.get('/featured', publicCache(60), getFeaturedTestimonials);
router.get('/', optionalAuth, publicCache(60), getTestimonials);

router.post('/', auth, createTestimonial);
router.get('/:id', auth, getTestimonial);
router.put('/:id', auth, updateTestimonial);
router.delete('/:id', auth, deleteTestimonial);

export default router;
