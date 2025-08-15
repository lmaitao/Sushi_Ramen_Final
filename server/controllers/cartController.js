import { 
  getCartByUserId, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../models/cartModel.js';

export const getCart = async (req, res) => {
  try {
    const cartItems = await getCartByUserId(req.user.id);
    res.json({ 
      success: true,
      data: cartItems 
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener carrito',
      details: error.message 
    });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false,
        error: 'Se requiere ID de producto' 
      });
    }
    
    const cartItem = await addToCart(req.user.id, productId, quantity || 1);
    res.status(201).json({ 
      success: true,
      data: cartItem 
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al agregar al carrito',
      details: error.message 
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Se requiere cantidad válida' 
      });
    }
    
    const updatedItem = await updateCartItem(req.user.id, productId, quantity);
    
    if (!updatedItem) {
      return res.json({ 
        success: true,
        message: 'Ítem eliminado del carrito' 
      });
    }
    
    res.json({ 
      success: true,
      data: updatedItem 
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar carrito',
      details: error.message 
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    await removeFromCart(req.user.id, productId);
    res.json({ 
      success: true,
      message: 'Ítem eliminado del carrito' 
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar del carrito',
      details: error.message 
    });
  }
};

export const clearUserCart = async (req, res) => {
  try {
    await clearCart(req.user.id);
    res.json({ 
      success: true,
      message: 'Carrito vaciado exitosamente' 
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al vaciar carrito',
      details: error.message 
    });
  }
};

export const getCartCount = async (req, res) => {
  try {
    const cartItems = await getCartByUserId(req.user.id);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ 
      success: true,
      count 
    });
  } catch (error) {
    console.error('Error getting cart count:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al contar items del carrito',
      details: error.message 
    });
  }
};