import express from 'express';
import {
  getProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler
} from '../controllers/productController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

// Rutas protegidas para admin
router.post('/', authenticate, adminOnly, createProductHandler);
router.put('/:id', authenticate, adminOnly, updateProductHandler);
router.delete('/:id', authenticate, adminOnly, deleteProductHandler);

export default router;