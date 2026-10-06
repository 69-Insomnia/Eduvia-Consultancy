import { Router } from 'express';
import { createContact, getContacts, markRead, deleteContact } from '../controllers/contactController';
import auth from '../middleware/auth';

const router = Router();

router.post('/', createContact);
router.get('/', auth, getContacts);
router.put('/:id/read', auth, markRead);
router.delete('/:id', auth, deleteContact);

export default router;
