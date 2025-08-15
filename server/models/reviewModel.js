import pool from '../config/db/db.js';

export const createReview = async (reviewData) => {
  const { userId, productId, rating, comment } = reviewData;
  const result = await pool.query(
    `INSERT INTO reviews (user_id, product_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, productId, rating, comment]
  );
  return result.rows[0];
};

export const getReviewsByProductId = async (productId) => {
  const result = await pool.query(
    `SELECT r.*, u.name as user_name 
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
    [productId]
  );
  return result.rows;
};

export const getUserReviewForProduct = async (userId, productId) => {
  const result = await pool.query(
    `SELECT r.*, u.name as user_name 
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.user_id = $1 AND r.product_id = $2`,
    [userId, productId]
  );
  return result.rows[0] || null;
};

export const updateReview = async (reviewId, rating, comment) => {
  const result = await pool.query(
    'UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3 RETURNING *',
    [rating, comment, reviewId]
  );
  return result.rows[0];
};

export const deleteReview = async (reviewId) => {
  await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
};

export const getAverageRating = async (productId) => {
  const result = await pool.query(
    'SELECT AVG(rating) as average, COUNT(*) as count FROM reviews WHERE product_id = $1',
    [productId]
  );
  return {
    average: parseFloat(result.rows[0].average) || 0,
    count: parseInt(result.rows[0].count)
  };
};