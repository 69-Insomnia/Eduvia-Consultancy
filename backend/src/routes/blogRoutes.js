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
} from '../controllers/blogController.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';

const router = Router();

// optionalAuth: only an authenticated admin may request drafts (isPublished=all).
router.get('/', optionalAuth, getBlogs);
router.get('/:slug', getBlogBySlug);

router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);
router.put('/:id/publish', auth, publishBlog);
router.put('/:id/unpublish', auth, unpublishBlog);
router.put('/:slug/views', incrementViews);

export default router;
