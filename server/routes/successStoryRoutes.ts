import { Router } from 'express';
import {
  getSuccessStories,
  getFeaturedSuccessStories,
  getSuccessStory,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} from '../controllers/successStoryController';
import auth from '../middleware/auth';
import optionalAuth from '../middleware/optionalAuth';

const router = Router();

router.get('/featured', getFeaturedSuccessStories);
router.get('/', optionalAuth, getSuccessStories);

router.post('/', auth, createSuccessStory);
router.get('/:id', auth, getSuccessStory);
router.put('/:id', auth, updateSuccessStory);
router.delete('/:id', auth, deleteSuccessStory);

export default router;
