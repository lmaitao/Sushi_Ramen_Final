import pool from '../config/db/db.js';


export const getCartByUserId = async (userId) => {
  const { rows } = await pool.query(
    'SELECT c.*, p.name, p.price, p.image_url FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
    [userId]
  );
  return rows;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  // Verificar si el producto ya está en el carrito
  const { rows: existingItems } = await pool.query(
    'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  if (existingItems.length > 0) {
    // Actualizar cantidad si ya existe
    const { rows } = await pool.query(
      'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, userId, productId]
    );
    return rows[0];
  } else {
    // Agregar nuevo item al carrito
    const { rows } = await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [userId, productId, quantity]
    );
    return rows[0];
  }
};

export const updateCartItem = async (userId, productId, quantity) => {
  if (quantity <= 0) {
    await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    return null;
  }

  const { rows } = await pool.query(
    'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
    [quantity, userId, productId]
  );
  return rows[0];
};

export const removeFromCart = async (userId, productId) => {
  await pool.query(
    'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
};

export const clearCart = async (userId) => {
  await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
};

export default {
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};