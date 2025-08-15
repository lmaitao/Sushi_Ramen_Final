import orderModel from '../models/orderModel.js';
import cartModel from '../models/cartModel.js';
import { sendOrderConfirmationEmail } from '../utils/email.js';
import pool from '../config/db/db.js';

const {
  createOrder,
  addOrderItem,
  getOrdersByUserId,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = orderModel;

const { getCartByUserId, clearCart } = cartModel;

export const checkout = async (req, res) => {
  try {
    const { paymentMethod, shippingAddress, notes } = req.body;
    const userId = req.user.id;

    if (!paymentMethod || !shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Método de pago y dirección son requeridos'
      });
    }

    const { rows: cartItems } = await pool.query(
      `SELECT c.*, p.name, p.price, p.image_url 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El carrito está vacío'
      });
    }

    const total = cartItems.reduce(
      (sum, item) => sum + (Number(item.price) * item.quantity),
      0
    );

    const order = await createOrder(
      userId,
      total,
      paymentMethod,
      shippingAddress,
      notes || null
    );

    for (const item of cartItems) {
      await addOrderItem(
        order.id,
        item.product_id,
        item.quantity,
        item.price
      );
    }

    await clearCart(userId);

    try {
      const orderDetails = await getOrderById(order.id);
      await sendOrderConfirmationEmail(req.user.email, {
        orderId: order.id,
        total: order.total,
        items: orderDetails.items,
        shippingAddress,
        paymentMethod
      });
    } catch (emailError) {
      console.error('Error enviando email de confirmación:', emailError);
    }

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        total: order.total,
        status: order.status
      },
      message: `Pedido #${order.id} creado exitosamente`
    });

  } catch (error) {
    console.error('Error en checkout:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al procesar el pedido'
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.getOrdersByUserId(req.user.id);
    
    // Mapear los nombres de los campos del backend al frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt, // Ya está en el formato correcto
      items: order.items
    }));

    res.json({
      success: true,
      data: Array.isArray(formattedOrders) ? formattedOrders : [],
      count: formattedOrders.length
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los pedidos',
      data: []
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await orderModel.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para ver este pedido'
      });
    }

    // Mapeo para unificar la respuesta
    const formattedOrder = {
      id: order.id,
      total: Number(order.total),
      status: order.status,
      paymentMethod: order.payment_method,
      shippingAddress: order.shipping_address,
      createdAt: order.created_at, // La fecha ya viene del modelo
      items: order.items.map(item => ({
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        price: Number(item.price),
      }))
    };

    res.json({
      success: true,
      data: formattedOrder
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el pedido'
    });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await getAllOrders();
    
    res.json({
      success: true,
      count: orders.length,
      data: orders.map(order => ({
        id: order.id,
        userId: order.user_id,
        userName: order.user_name,
        total: order.total,
        status: order.status,
        createdAt: order.created_at
      }))
    });

  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los pedidos'
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado no válido'
      });
    }

    const updatedOrder = await updateOrderStatus(orderId, status);

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        previousStatus: updatedOrder.previous_status
      },
      message: 'Estado del pedido actualizado'
    });

  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el pedido'
    });
  }
};

export default {
  checkout,
  getOrders,
  getOrder,
  getAllOrdersAdmin,
  updateOrder
};