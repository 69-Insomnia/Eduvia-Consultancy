import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
  updateStatus,
  addNote,
} from '../controllers/inquiryController';
import auth from '../middleware/auth';

const router = Router();

router.post('/', createInquiry);
router.get('/', auth, getInquiries);
router.get('/:id', auth, getInquiry);
router.put('/:id', auth, updateInquiry);
router.delete('/:id', auth, deleteInquiry);
router.put('/:id/status', auth, updateStatus);
router.put('/:id/notes', auth, addNote);

export default router;
