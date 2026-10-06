import { Router } from 'express';
import { login, logout, getMe, updatePassword } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, getMe);
router.put('/password', auth, updatePassword);

export default router;
