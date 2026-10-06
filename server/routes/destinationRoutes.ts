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

const router = Router();

router.get('/featured', getFeaturedDestinations);
router.get('/', optionalAuth, getDestinations);
router.get('/:slug', getDestinationBySlug);

router.post('/', auth, createDestination);
router.put('/:id', auth, updateDestination);
router.delete('/:id', auth, deleteDestination);

export default router;
