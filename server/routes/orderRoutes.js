import express from 'express';
import { 
  checkout, 
  getOrders, 
  getOrder,
  getAllOrdersAdmin,
  updateOrder
} from '../controllers/orderController.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas para usuarios normales
router.post('/checkout', checkout);
router.get('/', getOrders);
router.get('/:id', getOrder);

// Rutas solo para administradores
router.get('/admin/all', authorizeAdmin, getAllOrdersAdmin);
router.put('/admin/:id/status', authorizeAdmin, updateOrder);

export default router;