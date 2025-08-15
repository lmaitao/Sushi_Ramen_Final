import jwt from 'jsonwebtoken';
import pool from '../config/db/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Token de autorización requerido',
        code: 'MISSING_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1', 
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    const response = {
      success: false,
      error: 'Error de autenticación',
      code: 'AUTH_ERROR'
    };

    if (error.name === 'TokenExpiredError') {
      response.error = 'Token expirado';
      response.code = 'TOKEN_EXPIRED';
    } else if (error.name === 'JsonWebTokenError') {
      response.error = 'Token inválido';
      response.code = 'INVALID_TOKEN';
    }

    res.status(401).json(response);
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Acceso restringido: se requieren privilegios de administrador',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Acceso restringido. Roles permitidos: ${roles.join(', ')}`,
        code: 'ROLE_REQUIRED'
      });
    }
    next();
  };
};