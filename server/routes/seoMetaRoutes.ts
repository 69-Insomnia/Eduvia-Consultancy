import { Router } from 'express';
import {
  getEntitySeoMeta,
  getSeoMetaByType,
  listSeoMeta,
  upsertSeoMeta,
  deleteSeoMeta,
} from '../controllers/seoMetaController';
import auth from '../middleware/auth';

const router = Router();

// Public reads — the site fetches these to render extra JSON-LD and meta
// overrides. The by-type route is declared before the single-entity one is
// unnecessary (different segment counts), but both sit above `/entity` as a
// prefix of the admin routes below.
router.get('/entity/:entityType', getSeoMetaByType);
router.get('/entity/:entityType/:entityId', getEntitySeoMeta);

// Admin reads and writes.
router.get('/', auth, listSeoMeta);
router.put('/:entityType/:entityId', auth, upsertSeoMeta);
router.delete('/:id', auth, deleteSeoMeta);

export default router;
