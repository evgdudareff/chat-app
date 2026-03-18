import { Router } from 'express';
import { createUser, getUserById, updateUser } from '../controllers/userController.js';
import { protect } from '../controllers/authController.js';

const router = Router();

router.post('/', protect, createUser); // TODO: check if user is admin
router.get('/:id', protect, getUserById);
router.patch('/:id', protect, updateUser);

export default router;