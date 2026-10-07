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
import publicCache from '../middleware/publicCache';

const router = Router();

router.get('/all', auth, getAllFAQs);
router.get('/', optionalAuth, publicCache(60), getFAQs);

router.post('/', auth, createFAQ);
router.get('/:id', auth, getFAQ);
router.put('/:id', auth, updateFAQ);
router.delete('/:id', auth, deleteFAQ);

export default router;
