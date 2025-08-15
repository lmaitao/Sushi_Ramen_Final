import express from 'express';
import { 
  getCart, 
  addItemToCart, 
  updateCartItemQuantity, 
  removeItemFromCart, 
  clearUserCart,
  getCartCount
} from '../controllers/cartController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCart);
router.get('/count', getCartCount);
router.post('/', addItemToCart);
router.put('/:productId', updateCartItemQuantity);
router.delete('/:productId', removeItemFromCart);
router.delete('/', clearUserCart);

export default router;