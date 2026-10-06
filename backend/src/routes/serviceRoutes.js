import { Router } from 'express';
import {
  getServices,
  getAllServices,
  getService,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';

const router = Router();

router.get('/all', auth, getAllServices);
router.get('/', optionalAuth, getServices);

router.post('/', auth, createService);
router.get('/:id', auth, getService);
router.get('/slug/:slug', getServiceBySlug);
router.put('/:id', auth, updateService);
router.delete('/:id', auth, deleteService);

export default router;
