import { findUserById, updateUser } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
// Funciones del controlador de usuario
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;

        if (!name || !email) {
            return res.status(400).json({ error: 'Nombre y email son requeridos' });
        }

        const updatedUser = await updateUser(userId, { name, email });

        if (!updatedUser) {
            return res.status(400).json({ error: 'Error al actualizar el perfil' });
        }

        res.json({ message: 'Perfil actualizado correctamente', user: updatedUser });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el perfil' });
    }
};
// Funciones del controlador de usuario
export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
        }

        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateUser(userId, { password: hashedPassword });

        res.json({ message: 'Contraseña actualizada correctamente' });

    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar la contraseña' });
    }
};
