import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config(); // Carga las variables de entorno

// Configuración del transportador de correo.
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // Solo para desarrollo, no usar en producción sin un certificado válido
    }
});

/**
 * @function sendEmail
 * @description Función genérica para enviar correos electrónicos.
 * @param {Object} options - Objeto con las opciones del correo (to, subject, html).
 */
export const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Sushi & Ramen'}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado exitosamente a: ${to} (Asunto: ${subject})`);
        return true;
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw new Error('Error al enviar el correo');
    }
};

/**
 * @function sendResetEmail
 * @description Envía un correo electrónico para el reseteo de contraseña.
 * @param {string} toEmail - Dirección de correo electrónico del destinatario.
 * @param {string} token - Token de reseteo de contraseña.
 */
export const sendResetEmail = async (toEmail, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #2d3748; text-align: center;">Restablecer tu contraseña</h2>
            <p style="margin-bottom: 25px;">Haz clic en el siguiente botón para restablecer tu contraseña (este enlace expirará en 1 hora):</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #4299e1; 
                          color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    Restablecer contraseña
                </a>
            </div>
            
            <p style="color: #718096; font-size: 14px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                Si no solicitaste este cambio, puedes ignorar este mensaje.
            </p>
        </div>
    `;

    return sendEmail({
        to: toEmail,
        subject: 'Restablecimiento de contraseña',
        html
    });
};

/**
 * @function sendOrderCompletionEmail
 * @description Envía un correo electrónico al usuario cuando su pedido ha sido completado.
 * @param {string} toEmail - Dirección de correo electrónico del destinatario.
 * @param {Object} order - Objeto con los detalles del pedido (ej. id, total, status, created_at).
 */
export const sendOrderCompletionEmail = async (toEmail, order) => {
    const orderDetailsUrl = `${process.env.FRONTEND_URL}/orders/${order.id}`; 
    const total = Number(order.total) || 0; 

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
                <h2>🎉 ¡Tu pedido #${order.id} de Sushi & Ramen ha sido completado! 🎉</h2>
            </div>
            <div style="padding: 20px;">
                <p>Hola,</p>
                <p>¡Tenemos excelentes noticias! Tu pedido <strong>#${order.id}</strong> con un total de <strong>$${total.toFixed(2)}</strong> ha sido marcado como **completado**.</p>
                <p>¡Tu comida está lista para que la disfrutes! Agradecemos tu preferencia por Sushi & Ramen.</p>
                <p>Puedes ver los detalles completos de tu pedido haciendo clic en el siguiente botón:</p>
                <p style="text-align: center; margin: 25px 0;">
                    <a href="${orderDetailsUrl}" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Ver Detalles del Pedido
                    </a>
                </p>
                <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.</p>
                <p>¡Esperamos verte pronto!</p>
                <p>Saludos cordiales,<br/>El Equipo de Sushi & Ramen</p>
            </div>
            <div style="background-color: #f8f9fa; color: #666; padding: 15px; text-align: center; font-size: 0.8em; border-top: 1px solid #eee;">
                Este es un correo electrónico automático, por favor no lo respondas directamente.
            </div>
        </div>
    `;

    return sendEmail({
        to: toEmail,
        subject: `¡Pedido #${order.id} Completado - Sushi & Ramen!`,
        html
    });
};

/**
 * @function sendOrderPendingEmail
 * @description Envía un correo electrónico al usuario cuando su pedido está Pendiente.
 * @param {string} toEmail - Dirección de correo electrónico del destinatario.
 * @param {Object} order - Objeto con los detalles del pedido (ej. id, total).
 */
export const sendOrderPendingEmail = async (toEmail, order) => {
    const orderDetailsUrl = `${process.env.FRONTEND_URL}/orders/${order.id}`;
    const total = Number(order.total) || 0;

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #ffc107; color: #333; padding: 20px; text-align: center;">
                <h2>⚠️ ¡Tu pedido #${order.id} de Sushi & Ramen está Pendiente! ⚠️</h2>
            </div>
            <div style="padding: 20px;">
                <p>Hola,</p>
                <p>Tu pedido <strong>#${order.id}</strong> con un total de <strong>$${total.toFixed(2)}</strong> ha sido marcado como **pendiente**.</p>
                <p>Estamos revisando los detalles de tu pedido y nos pondremos en contacto contigo si necesitamos más información.</p>
                <p>Puedes ver los detalles completos de tu pedido haciendo clic en el siguiente botón:</p>
                <p style="text-align: center; margin: 25px 0;">
                    <a href="${orderDetailsUrl}" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Ver Detalles del Pedido
                    </a>
                </p>
                <p>Gracias por tu paciencia.</p>
                <p>Saludos cordiales,<br/>El Equipo de Sushi & Ramen</p>
            </div>
            <div style="background-color: #f8f9fa; color: #666; padding: 15px; text-align: center; font-size: 0.8em; border-top: 1px solid #eee;">
                Este es un correo electrónico automático, por favor no lo respondas directamente.
            </div>
        </div>
    `;

    return sendEmail({
        to: toEmail,
        subject: `¡Pedido #${order.id} Pendiente - Sushi & Ramen!`,
        html
    });
};

/**
 * @function sendOrderInProcessEmail
 * @description Envía un correo electrónico al usuario cuando su pedido está En Proceso.
 * @param {string} toEmail - Dirección de correo electrónico del destinatario.
 * @param {Object} order - Objeto con los detalles del pedido (ej. id, total).
 */
export const sendOrderInProcessEmail = async (toEmail, order) => {
    const orderDetailsUrl = `${process.env.FRONTEND_URL}/orders/${order.id}`;
    const total = Number(order.total) || 0;

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #17a2b8; color: white; padding: 20px; text-align: center;">
                <h2>🛠️ ¡Tu pedido #${order.id} de Sushi & Ramen está En Proceso! 🛠️</h2>
            </div>
            <div style="padding: 20px;">
                <p>Hola,</p>
                <p>¡Buenas noticias! Tu pedido <strong>#${order.id}</strong> con un total de <strong>$${total.toFixed(2)}</strong> ha sido marcado como **en proceso**.</p>
                <p>Esto significa que estamos preparando tu deliciosa comida y pronto estará lista.</p>
                <p>Puedes ver el estado y los detalles completos de tu pedido haciendo clic en el siguiente botón:</p>
                <p style="text-align: center; margin: 25px 0;">
                    <a href="${orderDetailsUrl}" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Seguir Mi Pedido
                    </a>
                </p>
                <p>¡Gracias por tu paciencia y esperamos que disfrutes!</p>
                <p>Saludos cordiales,<br/>El Equipo de Sushi & Ramen</p>
            </div>
            <div style="background-color: #f8f9fa; color: #666; padding: 15px; text-align: center; font-size: 0.8em; border-top: 1px solid #eee;">
                Este es un correo electrónico automático, por favor no lo respondas directamente.
            </div>
        </div>
    `;

    return sendEmail({
        to: toEmail,
        subject: `¡Pedido #${order.id} En Proceso - Sushi & Ramen!`,
        html
    });
};

/**
 * @function sendOrderCancelledEmail
 * @description Envía un correo electrónico al usuario cuando su pedido ha sido Cancelado.
 * @param {string} toEmail - Dirección de correo electrónico del destinatario.
 * @param {Object} order - Objeto con los detalles del pedido (ej. id, total).
 */
export const sendOrderCancelledEmail = async (toEmail, order) => {
    const orderDetailsUrl = `${process.env.FRONTEND_URL}/orders/${order.id}`;
    const total = Number(order.total) || 0;

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center;">
                <h2>❌ ¡Tu pedido #${order.id} de Sushi & Ramen ha sido Cancelado! ❌</h2>
            </div>
            <div style="padding: 20px;">
                <p>Hola,</p>
                <p>Lamentamos informarte que tu pedido <strong>#${order.id}</strong> con un total de <strong>$${total.toFixed(2)}</strong> ha sido **cancelado**.</p>
                <p>Si crees que esto es un error o tienes alguna pregunta, por favor contáctanos lo antes posible.</p>
                <p>Puedes ver los detalles de tu pedido cancelado haciendo clic en el siguiente botón:</p>
                <p style="text-align: center; margin: 25px 0;">
                    <a href="${orderDetailsUrl}" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Ver Detalles del Pedido
                    </a>
                </p>
                <p>Disculpa las molestias.</p>
                <p>Saludos cordiales,<br/>El Equipo de Sushi & Ramen</p>
            </div>
            <div style="background-color: #f8f9fa; color: #666; padding: 15px; text-align: center; font-size: 0.8em; border-top: 1px solid #eee;">
                Este es un correo electrónico automático, por favor no lo respondas directamente.
            </div>
        </div>
    `;

    return sendEmail({
        to: toEmail,
        subject: `¡Pedido #${order.id} Cancelado - Sushi & Ramen!`,
        html
    });
};

// Función para confirmación de pedidos (la que ya tenías, se mantiene por si la usas en otro lugar)
export const sendOrderConfirmationEmail = async (email, orderData) => {
    const total = Number(orderData.total) || 0;
    const items = Array.isArray(orderData.items) ? orderData.items : [];
  
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2d3748; text-align: center;">¡Gracias por tu pedido en Sushi Restaurant!</h2>
        <p style="text-align: center; font-size: 18px; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
          Número de pedido: <strong>#${orderData.orderId}</strong>
        </p>
        
        <div style="margin: 25px 0; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          <h3 style="color: #2d3748; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Detalles del Pedido</h3>
          
          ${items.length > 0 ? items.map(item => `
            <div style="display: flex; margin-bottom: 15px; align-items: center;">
              <img src="${item.imageUrl || 'https://via.placeholder.com/80?text=Sushi'}" 
                   style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
              <div style="flex-grow: 1;">
                <h4 style="margin: 0 0 5px 0;">${item.name || 'Producto'}</h4>
                <div style="display: flex; justify-content: space-between;">
                  <span>Cantidad: ${item.quantity || 1}</span>
                  <span>$${Number(item.price || 0).toFixed(2)} c/u</span>
                </div>
              </div>
            </div>
          `).join('') : '<p>No hay items en este pedido</p>'}
        </div>
  
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
          </div>
        </div>
  
        <div style="margin-top: 30px; color: #718096; font-size: 14px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          <p><strong>Método de pago:</strong> ${orderData.paymentMethod || 'No especificado'}</p>
          <p><strong>Dirección de envío:</strong> ${orderData.shippingAddress || 'No especificada'}</p>
          <p style="margin-top: 15px;">¿Tienes preguntas? Contacta a <a href="mailto:soporte@sushi.com" style="color: #4299e1;">soporte@sushi.com</a></p>
        </div>
      </div>
    `;
  
    return sendEmail({
      to: email,
      subject: `[Sushi] Confirmación de pedido #${orderData.orderId}`,
      html
    });
  };
