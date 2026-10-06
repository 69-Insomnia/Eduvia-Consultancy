import { Router } from 'express';
import {
  getTeamMembers,
  getAllTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';

const router = Router();

router.get('/all', auth, getAllTeamMembers);
router.get('/', optionalAuth, getTeamMembers);

router.post('/', auth, createTeamMember);
router.get('/:id', auth, getTeamMember);
router.put('/:id', auth, updateTeamMember);
router.delete('/:id', auth, deleteTeamMember);

export default router;
