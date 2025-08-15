import pool from '../config/db/db.js';

export const getAllProducts = async (category = null, search = null) => {
  let query = 'SELECT id, name, description, price::FLOAT, category, image_url, stock, is_active, created_at, updated_at FROM products WHERE is_active = TRUE'; // <-- Casteo de price
  const params = [];
  
  if (category) {
    query += ' AND category = $1';
    params.push(category);
  }
  
  if (search) {
    query += ' AND name ILIKE $' + (params.length + 1);
    params.push(`%${search}%`);
  }
  
  query += ' ORDER BY name';
  
  const result = await pool.query(query, params);
  return result.rows;
};

export const getProductById = async (id) => {
  const result = await pool.query('SELECT id, name, description, price::FLOAT, category, image_url, stock, is_active, created_at, updated_at FROM products WHERE id = $1 AND is_active = TRUE', [id]); // <-- Casteo de price
  return result.rows[0];
};

export const createProduct = async (name, description, price, category, image_url, stock) => {
  const result = await pool.query(
    'INSERT INTO products (name, description, price, category, image_url, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, description, price, category, image_url, stock]
  );
  return result.rows[0];
};

export const updateProduct = async (id, name, description, price, category, image_url, stock, is_active) => {
  const result = await pool.query(
    'UPDATE products SET name = $1, description = $2, price = $3, category = $4, image_url = $5, stock = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
    [name, description, price, category, image_url, stock, is_active, id]
  );
  return result.rows[0];
};

export const deleteProduct = async (id) => {
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
};

export const getProductsByIds = async (ids) => {
  // Asegúrate de que si usas esta, también casteas el price
  const result = await pool.query('SELECT id, name, description, price::FLOAT, category, image_url, stock, is_active, created_at, updated_at FROM products WHERE id = ANY($1)', [ids]); // <-- Casteo de price
  return result.rows;
};

export const getAverageRating = async (productId) => {
  const result = await pool.query(
    'SELECT AVG(rating) as average FROM reviews WHERE product_id = $1',
    [productId]
  );
  return result.rows[0]?.average || 0;
};

/**
 * @function countProducts
 * @description Cuenta el número total de productos activos en la base de datos.
 */
export const countProducts = async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM products WHERE is_active = TRUE'); 
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error('Error in countProducts model:', error);
    throw error;
  }
};
