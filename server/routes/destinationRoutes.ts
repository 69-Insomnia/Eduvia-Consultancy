import { Router } from 'express';
import {
  getDestinations,
  getFeaturedDestinations,
  getDestinationBySlug,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController';
import auth from '../middleware/auth';
import optionalAuth from '../middleware/optionalAuth';
import publicCache from '../middleware/publicCache';

const router = Router();

router.get('/featured', publicCache(60), getFeaturedDestinations);
router.get('/', optionalAuth, publicCache(60), getDestinations);
router.get('/:slug', publicCache(60), getDestinationBySlug);

router.post('/', auth, createDestination);
router.put('/:id', auth, updateDestination);
router.delete('/:id', auth, deleteDestination);

export default router;
