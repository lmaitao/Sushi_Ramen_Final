import { 
  getAllUsers, 
  findUserById,
  updateUser, 
  deleteUser,
  countUsers 
} from '../models/userModel.js';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct,
  countProducts 
} from '../models/productModel.js';
import { 
  updateOrderStatus,
  countOrders,      
  getTotalRevenue,  
  getRecentOrders,
  getAllOrders as getAllOrdersModel // Renombrado para evitar conflicto con la exportación del controlador
} from '../models/orderModel.js';
import { 
  sendOrderCompletionEmail,
  sendOrderPendingEmail,
  sendOrderInProcessEmail,
  sendOrderCancelledEmail 
} from '../utils/email.js'; 

// --- Funciones de Gestión de Usuarios ---

/**
 * @function getUsers
 * @description Obtiene todos los usuarios.
 */
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error in getUsers (adminController):', error);
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
};

/**
 * @function getUserById
 * @description Obtiene un usuario específico por su ID.
 * @param {Object} req - Objeto de solicitud de Express (params.id).
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const getUserById = async (req, res) => { 
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getUserById (adminController):', error);
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
};

/**
 * @function updateUserHandler
 * @description Actualiza la información de un usuario específico.
 * @param {Object} req - Objeto de solicitud de Express (params.id, body {name, email, role}).
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const updateUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Por favor, proporciona todos los campos requeridos (nombre, email, rol).' });
    }
    
    const user = await updateUser(id, { name, email, role }); 
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error in updateUserHandler (adminController):', error);
    res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
  }
};

/**
 * @function deleteUserHandler
 * @description Elimina un usuario de la base de datos.
 * @param {Object} req - Objeto de solicitud de Express (params.id).
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const deleteUserHandler = async (req, res) => {
  try {
    await deleteUser(req.params.id); 
    res.json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    console.error('Error in deleteUserHandler (adminController):', error);
    res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
  }
};

// --- Funciones de Gestión de Productos ---

/**
 * @function adminCreateProduct
 * @description Crea un nuevo producto.
 * @param {Object} req - Objeto de solicitud de Express (body con datos del producto).
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const adminCreateProduct = async (req, res) => {
  try {
    const { name, description, price, category, image_url, stock } = req.body;
    
    if (!name || !description || !price || !category || !image_url || stock === undefined) {
      return res.status(400).json({ error: 'Por favor, proporciona todos los campos requeridos para el producto.' });
    }
    
    const product = await createProduct(name, description, price, category, image_url, stock);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error in adminCreateProduct (adminController):', error);
    res.status(500).json({ error: 'Error al crear producto', details: error.message });
  }
};

/**
 * @function adminUpdateProduct
 * @description Actualiza la información de un producto existente.
 * @param {Object} req - Objeto de solicitud de Express (params.id, body con datos del producto).
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const adminUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, stock, is_active } = req.body;
    
    const product = await updateProduct(
      id, 
      name, 
      description, 
      price, 
      category, 
      image_url, 
      stock, 
      is_active
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error in adminUpdateProduct (adminController):', error);
    res.status(500).json({ error: 'Error al actualizar producto', details: error.message });
  }
};

/**
 * @function adminDeleteProduct
 * @description Elimina un producto.
 * @param {Object} req - Objeto de solicitud de Express (params.id).
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const adminDeleteProduct = async (req, res) => {
  try {
    await deleteProduct(req.params.id); 
    res.json({ message: 'Producto eliminado exitosamente.' });
  } catch (error) {
    console.error('Error in adminDeleteProduct (adminController):', error);
    res.status(500).json({ error: 'Error al eliminar producto', details: error.message });
  }
};

// --- Funciones de Gestión de Pedidos ---

/**
 * @function getAllOrders
 * @description Obtiene todos los pedidos.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const getAllOrders = async (req, res) => { 
  try {
    const orders = await getAllOrdersModel(); 
    res.json(orders);
  } catch (error) {
    console.error('Error in getAllOrders (adminController):', error);
    res.status(500).json({ error: 'Error al obtener pedidos', details: error.message });
  }
};

/**
 * @function adminUpdateOrder
 * @description Actualiza el estado de un pedido específico y envía un email según el nuevo estado.
 * @param {Object} req - Objeto de solicitud de Express (params.id, body {status}).
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const adminUpdateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'El estado del pedido es requerido.' });
    }
    
    const order = await updateOrderStatus(id, status);
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }

    // ⭐ Lógica para enviar email según el estado ⭐
    const user = await findUserById(order.user_id);
    if (user && user.email) {
      switch (order.status) {
        case 'completed':
          await sendOrderCompletionEmail(user.email, order);
          break;
        case 'pending':
          await sendOrderPendingEmail(user.email, order);
          break;
        case 'processing': 
          await sendOrderInProcessEmail(user.email, order);
          break;
        case 'cancelled':
          await sendOrderCancelledEmail(user.email, order);
          break;
        default:
          console.warn(`Estado de pedido desconocido para el email: ${order.status}`);
          break;
      }
    } else {
      console.warn(`No se pudo enviar email para el pedido ${order.id}: Usuario o email no encontrado.`);
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error in adminUpdateOrder (adminController):', error);
    res.status(500).json({ error: 'Error al actualizar pedido', details: error.message });
  }
};

/**
 * @function getDashboardStats
 * @description Obtiene estadísticas consolidadas para el panel de administración.
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await countUsers();
    const totalProducts = await countProducts();
    const totalOrders = await countOrders();
    const totalRevenue = await getTotalRevenue();
    const recentOrders = await getRecentOrders();

    res.json({
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      revenue: totalRevenue,
      recentOrders: recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard stats (adminController):', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard', details: error.message });
  }
};
