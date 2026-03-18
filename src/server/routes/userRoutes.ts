import { Router } from 'express';
import {
  createUser,
  getUserById,
  updateUser,
  restrictTo,
} from '../controllers/userController.js';
import { protect } from '../controllers/authController.js';

const router = Router();

router.post('/', protect, restrictTo('admin'), createUser);
router.get('/:id', protect, getUserById);
router.patch('/:id', protect, updateUser);

export default router;