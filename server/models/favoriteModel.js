import pool from '../config/db/db.js';

export const getFavoritesByUserId = async (userId) => {
  const { rows } = await pool.query(
    `SELECT p.*, f.created_at as favorited_at 
     FROM favorites f
     JOIN products p ON f.product_id = p.id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows;
};

export const addFavorite = async (userId, productId) => {
  const { rows } = await pool.query(
    `INSERT INTO favorites (user_id, product_id)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, productId]
  );
  return rows[0];
};

export const removeFavorite = async (userId, productId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM favorites
     WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );
  return rowCount > 0;
};

export const isFavorite = async (userId, productId) => {
  const { rows } = await pool.query(
    `SELECT 1 FROM favorites
     WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );
  return rows.length > 0;
};

export const countUserFavorites = async (userId) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM favorites
     WHERE user_id = $1`,
    [userId]
  );
  return parseInt(rows[0].count);
};