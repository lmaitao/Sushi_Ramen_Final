import express from 'express';
import { 
  register, 
  login, 
  logout,
  forgotPassword, 
  resetPasswordHandler,
  verifyResetToken,
  verifyToken,
  getMe
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordHandler);
router.get('/me', authenticate, getMe);
router.get('/verify', verifyToken);
router.get('/verify-reset-token', verifyResetToken);

export default router;