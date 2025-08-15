import express from 'express';
import { 
  getUsers, 
  getUserById, // <-- ¡NUEVO! Para obtener un usuario específico
  updateUserHandler, 
  deleteUserHandler,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  getAllOrders, // <-- ¡NUEVO! Para obtener todos los pedidos
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
router.get('/users', getUsers); // Obtener todos los usuarios
router.get('/users/:id', getUserById); // <-- ¡NUEVA! Obtener un usuario por ID
router.put('/users/:id', updateUserHandler);
router.delete('/users/:id', deleteUserHandler);

// --- Rutas de Gestión de Productos ---
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// --- Rutas de Gestión de Pedidos ---
router.get('/orders', getAllOrders); // <-- ¡NUEVA! Obtener todos los pedidos
router.put('/orders/:id', adminUpdateOrder);

export default router;
