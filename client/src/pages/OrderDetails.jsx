import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/format';

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return;
      
     try {
  setLoading(true);
  const response = await API.get(`/orders/${id}`);

  if (!response.data?.data) {
    throw new Error('No se recibieron datos del pedido');
  }

  const orderData = response.data.data;
  setOrder(orderData); // Guardamos la data sin modificar la fecha
} catch (error) {
        console.error('Error fetching order:', error);
        toast.error(error.response?.data?.error || 'Error al cargar el pedido');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h3>Debes iniciar sesión para ver este pedido</h3>
        <Link to="/login" className="btn btn-primary mt-3">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="container my-5 text-center"><h4>Pedido no encontrado</h4></div>;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Pedido #{order.id}</h2>
                <span className={`badge ${
                  order.status === 'completed' ? 'bg-success' :
                  // eslint-disable-next-line
                  order.status === 'cancelled' ? 'bg-danger' :
                  'bg-warning text-dark'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="mb-4">
                <h5>Detalles del Pedido</h5>
               <p>
  <strong>Fecha:</strong> {formatDate(order.createdAt)}
</p>
                <p>
                  <strong>Método de Pago:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Dirección de Envío:</strong> {order.shippingAddress}
                </p>
              </div>
              
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, index) => (
                      <tr key={`${item.productId}-${index}`}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.imageUrl}
                              alt={item.name}
                              className="me-3 rounded"
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-product.png';
                              }}
                            />
                            <div>
                              <h6 className="mb-0">{item.name}</h6>
                              <small className="text-muted">ID: {item.productId}</small>
                            </div>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>${Number(item.price).toFixed(2)}</td>
                        <td>${(Number(item.price) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Resumen del Pedido</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${order.items?.reduce(
                  (sum, item) => sum + (Number(item.price) * item.quantity), 0
                ).toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between fw-bold mb-4">
                <span>Total:</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>

              <Link to="/products" className="btn btn-primary w-100">
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;