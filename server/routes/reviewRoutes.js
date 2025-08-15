import express from 'express';
import { 
  createProductReview, 
  getProductReviews, 
  getUserProductReview,
  updateProductReview, 
  deleteProductReview,
  getProductRating
} from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:productId', getProductReviews);
router.get('/:productId/rating', getProductRating);

router.use(authenticate);

router.get('/user/:userId', getUserProductReview);
router.post('/', createProductReview);
router.put('/:reviewId', updateProductReview);
router.delete('/:reviewId', deleteProductReview);

export default router;