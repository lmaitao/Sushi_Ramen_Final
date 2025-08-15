import express from 'express';
import { 
  getFavorites, 
  toggleFavorite, 
  checkFavorite,
  removeFavoriteItem,
  countFavorites
} from '../controllers/favoriteController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Ruta para verificar si un producto es favorito
router.get('/check/:productId', checkFavorite);

// Obtener todos los favoritos del usuario
router.get('/', getFavorites);

// Obtener el conteo de favoritos
router.get('/count', countFavorites);

// Alternar favorito (añadir/eliminar)
router.post('/toggle', toggleFavorite);

// Eliminar un favorito específico
router.delete('/:productId', removeFavoriteItem);

export default router;