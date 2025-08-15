import { 
  createReview, 
  getReviewsByProductId, 
  getUserReviewForProduct, 
  updateReview, 
  deleteReview,
  getAverageRating
} from '../models/reviewModel.js';

export const createProductReview = async (req, res) => {
  try {
    const { productId, rating, comment = '' } = req.body;

    // Validaciones
    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'productId y rating son requeridos',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'El rating debe estar entre 1 y 5',
        code: 'INVALID_RATING'
      });
    }

    // Verificar si ya existe reseña
    const existingReview = await getUserReviewForProduct(req.user.id, productId);
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'Ya has creado una reseña para este producto',
        code: 'REVIEW_ALREADY_EXISTS'
      });
    }

    // Crear la reseña
    const review = await createReview({
      userId: req.user.id,
      productId,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Reseña creada exitosamente'
    });
  } catch (error) {
    console.error('Error en createProductReview:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear la reseña',
      details: error.message
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await getReviewsByProductId(req.params.productId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener reseñas',
      details: error.message 
    });
  }
};

export const getUserProductReview = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.query;

    // Validación más robusta
    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un productId válido',
        code: 'INVALID_PRODUCT_ID'
      });
    }

    const review = await getUserReviewForProduct(userId, productId);
    
    if (!review) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No se encontró reseña para este producto'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error en getUserProductReview:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la reseña',
      details: error.message
    });
  }
};

export const updateProductReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment = '', productId } = req.body;

    // Validación mejorada
    if (!reviewId || isNaN(reviewId)) {
      return res.status(400).json({
        error: 'ID de reseña inválido',
        code: 'INVALID_REVIEW_ID'
      });
    }

    if (!productId) {
      return res.status(400).json({
        error: 'productId es requerido en el cuerpo de la solicitud',
        code: 'MISSING_PRODUCT_ID'
      });
    }

    // Verificar existencia de la reseña
    const review = await getUserReviewForProduct(req.user.id, productId);
    if (!review) {
      return res.status(404).json({ 
        error: 'Reseña no encontrada',
        code: 'REVIEW_NOT_FOUND' 
      });
    }

    // Actualizar
    const updatedReview = await updateReview(reviewId, rating, comment);
    res.json(updatedReview);

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      error: 'Error al actualizar la reseña',
      details: error.message 
    });
  }
};

export const deleteProductReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    // Verificar que la reseña pertenece al usuario
    const review = await getUserReviewForProduct(req.user.id, req.body.productId);
    
    if (!review || review.id !== parseInt(reviewId)) {
      return res.status(404).json({ error: 'Review not found or not authorized' });
    }
    
    await deleteReview(reviewId);
    const ratings = await getAverageRating(req.body.productId);
    
    res.json({ message: 'Review deleted', ratings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductRating = async (req, res) => {
  try {
    const ratings = await getAverageRating(req.params.productId);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};