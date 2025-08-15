import pool from '../config/db/db.js';

export const createOrder = async (userId, total, paymentMethod, shippingAddress, notes = null) => {
  const result = await pool.query(
    `INSERT INTO orders (
      user_id, 
      total, 
      payment_method, 
      shipping_address,
      notes
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, total, status, payment_method, shipping_address, notes, created_at as "createdAt"`,
    [userId, total, paymentMethod, shippingAddress, notes]
  );
  
  if (!result.rows[0]) {
    throw new Error('No se pudo crear el pedido');
  }
  
  return result.rows[0];
};

export const addOrderItem = async (orderId, productId, quantity, price) => {
  await pool.query(
    `INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)`,
    [orderId, productId, quantity, price]
  );
};

export const getOrdersByUserId = async (userId) => {
  const { rows } = await pool.query(
    `SELECT 
      o.id,
      o.total::FLOAT,
      o.status,
      o.payment_method as "paymentMethod",
      o.shipping_address as "shippingAddress",
      o.created_at as "createdAt",
      json_agg(
        json_build_object(
          'productId', oi.product_id,
          'name', p.name,
          'imageUrl', p.image_url,
          'quantity', oi.quantity,
          'price', oi.price::FLOAT
        )
      ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
    [userId]
  );
  return rows;
};

export const getOrderById = async (orderId) => {
  const orderResult = await pool.query(
    `SELECT 
      o.*,
      u.name as user_name,
      u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1`,
    [orderId]
  );
  
  if (!orderResult.rows.length) {
    return null;
  }

  const itemsResult = await pool.query(
    `SELECT 
      oi.product_id as "productId",
      oi.quantity,
      oi.price::FLOAT,
      p.name,
      p.image_url as "imageUrl"
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1`,
    [orderId]
  );

  return {
    ...orderResult.rows[0],
    items: itemsResult.rows.map(item => ({
      ...item,
      imageUrl: item.imageUrl || '/default-product.png'
    }))
  };
};

/**
 * @function getAllOrders
 * @description Obtiene todos los pedidos con información del usuario y conteo de ítems.
 * @returns {Promise<Array<Object>>} - Una promesa que resuelve con una lista de todos los pedidos.
 */
export const getAllOrders = async () => { // <-- ¡NUEVA FUNCIÓN!
  const { rows } = await pool.query(
    `SELECT 
      o.id,
      o.user_id,
      u.name as user_name,
      o.total::FLOAT, -- Casteo a FLOAT
      o.status,
      o.payment_method as "paymentMethod",
      o.shipping_address as "shippingAddress",
      o.created_at as "createdAt",
      COUNT(oi.id)::INTEGER as items_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u.name
      ORDER BY o.created_at DESC`
  );
  return rows;
};


export const updateOrderStatus = async (orderId, status) => {
  const { rows } = await pool.query(
    `UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *`,
    [status, orderId]
  );
  return rows[0];
};

/**
 * @function countOrders
 * @description Cuenta el número total de pedidos en la base de datos.
 */
export const countOrders = async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM orders');
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error('Error in countOrders model:', error);
    throw error;
  }
};

/**
 * @function getTotalRevenue
 * @description Calcula los ingresos totales de todos los pedidos completados.
 */
export const getTotalRevenue = async () => {
  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(total)::FLOAT, 0) AS revenue FROM orders WHERE status = 'completed'` 
    );
    return parseFloat(result.rows[0].revenue);
  } catch (error) {
    console.error('Error in getTotalRevenue model:', error);
    throw error;
  }
};

/**
 * @function getRecentOrders
 * @description Obtiene una lista de los pedidos más recientes junto con el nombre del usuario.
 */
export const getRecentOrders = async (limit = 5) => {
  try {
    const result = await pool.query(
      `SELECT 
          o.id, 
          u.name AS user_name, 
          o.total::FLOAT, -- ¡CLAVE! Castear 'total' a FLOAT aquí
          o.status, 
          o.created_at
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT $1`,
      [limit] 
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getRecentOrders model:', error);
    throw error;
  }
};


export default {
  createOrder,
  addOrderItem,
  getOrdersByUserId,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};