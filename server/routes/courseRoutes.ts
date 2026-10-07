import { Router } from 'express';
import {
  getCourses,
  getCourseBySlug,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';
import auth from '../middleware/auth';
import optionalAuth from '../middleware/optionalAuth';
import publicCache from '../middleware/publicCache';

const router = Router();

router.get('/', optionalAuth, publicCache(60), getCourses);
router.get('/:slug', publicCache(60), getCourseBySlug);

router.post('/', auth, createCourse);
router.put('/:id', auth, updateCourse);
router.delete('/:id', auth, deleteCourse);

export default router;
