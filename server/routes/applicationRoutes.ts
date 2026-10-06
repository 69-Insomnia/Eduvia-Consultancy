import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
} from '../controllers/applicationController';
import auth from '../middleware/auth';

const router = Router();

router.use(auth);
router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.put('/:id/status', updateApplicationStatus);

export default router;
