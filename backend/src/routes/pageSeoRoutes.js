import { Router } from 'express';
import {
  getPublicPageSeo,
  getAdminPageSeo,
  updatePageSeo,
  resetPageSeo,
} from '../controllers/pageSeoController.js';
import auth from '../middleware/auth.js';

const router = Router();

// Public read — the site fetches this once to apply page metadata overrides.
router.get('/', getPublicPageSeo);

// Admin reads and writes. `/admin` is declared before `/:key` so it is not
// swallowed by the parameterised route.
router.get('/admin', auth, getAdminPageSeo);
router.put('/:key', auth, updatePageSeo);
router.delete('/:key/seo', auth, resetPageSeo);

export default router;
