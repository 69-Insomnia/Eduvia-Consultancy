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
import publicCache from '../middleware/publicCache';

const router = Router();

router.get('/featured', publicCache(60), getFeaturedSuccessStories);
router.get('/', optionalAuth, publicCache(60), getSuccessStories);

router.post('/', auth, createSuccessStory);
router.get('/:id', auth, getSuccessStory);
router.put('/:id', auth, updateSuccessStory);
router.delete('/:id', auth, deleteSuccessStory);

export default router;
