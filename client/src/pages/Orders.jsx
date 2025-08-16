import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/format';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await API.get('/orders', { 
          signal: controller.signal
        });
        
        if (isMounted) {
          const receivedOrders = response.data?.data || [];
          setOrders(Array.isArray(receivedOrders) ? receivedOrders : []);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Error:', error);
          setError('Error al cargar pedidos');
          toast.error('Error al cargar pedidos');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user]);

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h3>Debes iniciar sesión para ver tus pedidos</h3>
        <Link to="/login" className="btn btn-primary mt-3">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container my-5 text-center text-danger">{error}</div>;

  return (
    <div className="container my-5">
      <h1 className="mb-4">Tus Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h4>No tienes pedidos aún</h4>
          <Link to="/products" className="btn btn-primary mt-3">
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>${Number(order.total).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${
                      order.status === 'completed' ? 'bg-success' :
                      order.status === 'cancelled' ? 'bg-danger' :
                      'bg-warning text-dark'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link 
                      to={`/orders/${order.id}`} 
                      className="btn btn-sm btn-outline-primary"
                    >
                      Ver Detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;