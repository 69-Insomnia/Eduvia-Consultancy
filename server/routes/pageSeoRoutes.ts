import { Router } from 'express';
import {
  getPublicPageSeo,
  getAdminPageSeo,
  updatePageSeo,
  resetPageSeo,
} from '../controllers/pageSeoController';
import auth from '../middleware/auth';
import publicCache from '../middleware/publicCache';

const router = Router();

// Public read — the site fetches this once to apply page metadata overrides.
// Like settings, it is read on every page load and written rarely.
router.get('/', publicCache(300), getPublicPageSeo);

// Admin reads and writes. `/admin` is declared before `/:key` so it is not
// swallowed by the parameterised route.
router.get('/admin', auth, getAdminPageSeo);
router.put('/:key', auth, updatePageSeo);
router.delete('/:key/seo', auth, resetPageSeo);

export default router;
