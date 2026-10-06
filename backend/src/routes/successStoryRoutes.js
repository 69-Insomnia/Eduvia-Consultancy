import { Router } from 'express';
import {
  getSuccessStories,
  getFeaturedSuccessStories,
  getSuccessStory,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} from '../controllers/successStoryController.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';

const router = Router();

router.get('/featured', getFeaturedSuccessStories);
router.get('/', optionalAuth, getSuccessStories);

router.post('/', auth, createSuccessStory);
router.get('/:id', auth, getSuccessStory);
router.put('/:id', auth, updateSuccessStory);
router.delete('/:id', auth, deleteSuccessStory);

export default router;
