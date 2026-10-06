import { Router } from 'express';
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController';
import auth from '../middleware/auth';

const router = Router();

router.use(auth);
router.post('/', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
