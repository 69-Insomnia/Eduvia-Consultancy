import { Router } from 'express';
import {
  getFAQs,
  getAllFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controllers/faqController';
import auth from '../middleware/auth';
import optionalAuth from '../middleware/optionalAuth';

const router = Router();

router.get('/all', auth, getAllFAQs);
router.get('/', optionalAuth, getFAQs);

router.post('/', auth, createFAQ);
router.get('/:id', auth, getFAQ);
router.put('/:id', auth, updateFAQ);
router.delete('/:id', auth, deleteFAQ);

export default router;
