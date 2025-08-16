import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db/db.js';
import { config } from 'dotenv';

config();

export const createUser = async (name, email, password, role = 'user') => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        `INSERT INTO users (name, email, password, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, name, email, role, created_at`,
        [name, email, hashedPassword, role]
    );
    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        'SELECT id, name, email, password, role FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

export const findUserById = async (id) => {
    const result = await pool.query(
        'SELECT id, name, email, password, role FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

export const findUserByResetToken = async (token) => {
    try {
        const result = await pool.query(
            `SELECT id, email, reset_password_expires 
            FROM users 
            WHERE reset_password_token = $1 
            AND reset_password_expires > NOW()`,
            [token]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error en findUserByResetToken:', error);
        throw error;
    }
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const updateUser = async (id, data) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name, email, role`;

    if (fields.length === 0) {
        return null;
    }

    const result = await pool.query(query, [id, ...values]);
    
    return result.rows[0];
};

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
};

/**
 * @function setResetPasswordToken
 * @description Establece el token y la fecha de expiración para el reseteo de contraseña de un usuario.
 * @param {string} email - El correo electrónico del usuario.
 * @param {string} token - El token de reseteo generado.
 * @param {Date} expires - La fecha y hora de expiración del token.
 */
export const setResetPasswordToken = async (email, token, expires) => {
    try {
        await pool.query(
            `UPDATE users 
            SET reset_password_token = $1,
                reset_password_expires = $2 
            WHERE email = $3`,
            // 💡 CORRECCIÓN CLAVE: Asegúrate de pasar 'email' como el tercer parámetro aquí.
            [token, expires, email] 
        );
    } catch (error) {
        console.error('Error en setResetPasswordToken:', error);
        throw error;
    }
};

export const resetPassword = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
        `UPDATE users 
        SET password = $1, 
            reset_password_token = NULL, 
            reset_password_expires = NULL 
        WHERE id = $2 
        RETURNING id, name, email, role`,
        [hashedPassword, userId]
    );
    return result.rows[0];
};

export const getAllUsers = async () => {
    const result = await pool.query(
        'SELECT id, name, email, role FROM users ORDER BY id ASC'
    );
    return result.rows;
};

export const deleteUser = async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

export const countUsers = async () => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM users');
        return parseInt(result.rows[0].count, 10);
    } catch (error) {
        console.error('Error in countUsers model:', error);
        throw error; 
    }
};
