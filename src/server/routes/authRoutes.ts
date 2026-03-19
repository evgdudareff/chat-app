import { Router } from 'express';
import {
  signup,
  login,
  protect,
  me,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, me);

export default router;
