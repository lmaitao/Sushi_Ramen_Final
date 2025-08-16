import express from 'express';
import { 
  getUsers, 
  getUserById,
  updateUserHandler, 
  deleteUserHandler,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  getAllOrders,
  adminUpdateOrder,
  getDashboardStats 
} from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(adminOnly);

// Ruta para las estadísticas del dashboard
router.get('/stats', getDashboardStats);

// --- Rutas de Gestión de Usuarios ---
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserHandler);
router.delete('/users/:id', deleteUserHandler);

// --- Rutas de Gestión de Productos ---
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// --- Rutas de Gestión de Pedidos ---
router.get('/orders', getAllOrders);
router.put('/orders/:id', adminUpdateOrder);

export default router;
