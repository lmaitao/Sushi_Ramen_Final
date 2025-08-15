import express from 'express';
import { updateProfile, updatePassword } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
// Todas las rutas requieren autenticación
router.put('/:id', authenticate, updateProfile);
router.put('/:id/password', authenticate, updatePassword);

export default router;