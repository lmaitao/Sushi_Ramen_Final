import { 
  findUserByEmail, 
  findUserByResetToken, 
  comparePassword, 
  generateToken, 
  setResetPasswordToken, 
  resetPassword, 
  createUser,
  findUserById
} from '../models/userModel.js';
import { sendResetEmail } from '../utils/email.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'; 

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
     // Validación de campos obligatorios
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
      const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const user = await createUser(name, email, password);
    const token = generateToken(user.id);
    

    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al registrar el usuario',
      details: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    const token = generateToken(user.id);
    res.status(200).json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al iniciar sesión',
      details: error.message 
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Opción 1: Si usas JWT con blacklist
    // Aquí podrías invalidar el token si usas ese sistema
    
    // Opción 2: Respuesta simple
    res.status(200).json({ 
      success: true,
      message: 'Sesión cerrada exitosamente' 
    });
  } catch (error) {
    // Aún así responde con éxito para que el frontend pueda limpiar
    res.status(200).json({ 
      success: true,
      message: 'Sesión cerrada (token no invalidado)' 
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    await setResetPasswordToken(email, resetToken, resetExpires);
    await sendResetEmail(email, resetToken);

    res.json({ 
      message: 'Correo de recuperación enviado',
      token: resetToken // Solo para desarrollo
    });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message
    });
  }
};

export const resetPasswordHandler = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        error: 'Token y nueva contraseña son requeridos',
        code: 'MISSING_DATA'
      });
    }
    
    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ 
        error: 'Token inválido o expirado',
        code: 'INVALID_TOKEN'
      });
    }
    
    await resetPassword(user.id, newPassword);
    res.json({ 
      message: 'Contraseña actualizada exitosamente',
      email: user.email
    });
  } catch (error) {
    console.error('Error en resetPasswordHandler:', error);
    res.status(500).json({ 
      error: 'Error al actualizar contraseña',
      details: error.message
    });
  }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await findUserById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener el usuario' });
    }
};

export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ 
        error: 'Token es requerido',
        code: 'MISSING_TOKEN' 
      });
    }

    const user = await findUserByResetToken(token);
    
    if (!user) {
      return res.status(400).json({ 
        error: 'Token inválido o expirado',
        code: 'INVALID_TOKEN'
      });
    }
    
    res.json({ 
      valid: true,
      email: user.email
    });
  } catch (error) {
    console.error('Error en verifyResetToken:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ 
        success: false,
        error: 'Formato de token inválido',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({ 
      success: true,
      message: 'Token válido'
    });
  } catch (error) {
    console.error('Error en verifyToken:', error);
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false,
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false,
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      code: 'SERVER_ERROR'
    });
  }
};