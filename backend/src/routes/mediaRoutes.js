import { Router } from 'express';
import { uploadMiddleware, uploadFile, getMedia, deleteMedia } from '../controllers/mediaController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);
router.post('/upload', uploadMiddleware, uploadFile);
router.get('/', getMedia);
router.delete('/:id', deleteMedia);

export default router;
