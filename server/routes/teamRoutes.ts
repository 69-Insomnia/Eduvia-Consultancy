import { Router } from 'express';
import {
  getTeamMembers,
  getAllTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController';
import auth from '../middleware/auth';
import optionalAuth from '../middleware/optionalAuth';

const router = Router();

router.get('/all', auth, getAllTeamMembers);
router.get('/', optionalAuth, getTeamMembers);

router.post('/', auth, createTeamMember);
router.get('/:id', auth, getTeamMember);
router.put('/:id', auth, updateTeamMember);
router.delete('/:id', auth, deleteTeamMember);

export default router;
