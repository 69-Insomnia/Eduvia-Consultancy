import { Router } from 'express';
import {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  incrementViews,
} from '../controllers/blogController';
import auth from '../middleware/auth';
import optionalAuth from '../middleware/optionalAuth';
import publicCache from '../middleware/publicCache';

const router = Router();

// optionalAuth: only an authenticated admin may request drafts (isPublished=all).
router.get('/', optionalAuth, publicCache(60), getBlogs);
router.get('/:slug', publicCache(60), getBlogBySlug);

router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);
router.put('/:id/publish', auth, publishBlog);
router.put('/:id/unpublish', auth, unpublishBlog);
router.put('/:slug/views', incrementViews);

export default router;
