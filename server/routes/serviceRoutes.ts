import { Router } from 'express';
import {
  getServices,
  getAllServices,
  getService,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import auth from '../middleware/auth';
import optionalAuth from '../middleware/optionalAuth';
import publicCache from '../middleware/publicCache';

const router = Router();

router.get('/all', auth, getAllServices);
router.get('/', optionalAuth, publicCache(60), getServices);

router.post('/', auth, createService);
router.get('/:id', auth, getService);
router.get('/slug/:slug', publicCache(60), getServiceBySlug);
router.put('/:id', auth, updateService);
router.delete('/:id', auth, deleteService);

export default router;
