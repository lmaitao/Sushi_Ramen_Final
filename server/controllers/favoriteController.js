import { 
  getFavoritesByUserId, 
  addFavorite, 
  removeFavorite, 
  isFavorite,
  countUserFavorites
} from '../models/favoriteModel.js';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await getFavoritesByUserId(req.user.id);
    res.json({ 
      success: true, 
      data: favorites,
      count: favorites.length 
    });
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener favoritos'
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false,
        error: 'ID de producto inválido' 
      });
    }
    
    const favoriteExists = await isFavorite(req.user.id, productId);
    
    if (favoriteExists) {
      await removeFavorite(req.user.id, productId);
      const favorites = await getFavoritesByUserId(req.user.id);
      return res.json({ 
        success: true,
        isFavorite: false,
        data: favorites,
        message: 'Eliminado de favoritos' 
      });
    } else {
      await addFavorite(req.user.id, productId);
      const favorites = await getFavoritesByUserId(req.user.id);
      return res.json({ 
        success: true,
        isFavorite: true,
        data: favorites,
        message: 'Agregado a favoritos'
      });
    }
  } catch (error) {
    console.error('Error alternando favorito:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar favoritos'
    });
  }
};


export const checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de producto inválido'
      });
    }

    const isFav = await isFavorite(req.user.id, parseInt(productId));
    res.json({ 
      success: true,
      isFavorite: isFav 
    });
  } catch (error) {
    console.error('Error verificando favorito:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al verificar favorito',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const removeFavoriteItem = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de producto inválido'
      });
    }

    const deleted = await removeFavorite(req.user.id, parseInt(productId));
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Favorito no encontrado'
      });
    }

    const count = await countUserFavorites(req.user.id);
    res.json({ 
      success: true,
      count,
      message: 'Eliminado de favoritos' 
    });
  } catch (error) {
    console.error('Error eliminando favorito:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar de favoritos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const countFavorites = async (req, res) => {
  try {
    const count = await countUserFavorites(req.user.id);
    res.json({ 
      success: true,
      count 
    });
  } catch (error) {
    console.error('Error contando favoritos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al contar favoritos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};