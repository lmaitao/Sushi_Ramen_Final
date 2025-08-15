import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import CartItem from '../components/cart/CartItem';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaShoppingCart } from 'react-icons/fa';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Se envuelve la función en useCallback para que no se recree en cada render
  // y se pueda usar de forma segura en las dependencias de useEffect.
  const fetchCartData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [cartRes, countRes] = await Promise.all([
        API.get('/cart'),
        API.get('/cart/count')
      ]);
      
      setCartItems(cartRes.data.data || []);
      setCartCount(countRes.data.count || 0);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message);
      toast.error(err.message || 'Error al cargar el carrito');
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchCartData();
    } else {
      setLoading(false);
    }
  }, [user, fetchCartData]); // Se agrega fetchCartData como dependencia

  const handleCartAction = async (action, ...args) => {
    setUpdating(true);
    try {
      await action(...args);
      await fetchCartData(); // Refresh data after any action
    } catch (err) {
      console.error('Cart action error:', err);
      toast.error(err.message || 'Error al actualizar carrito');
    } finally {
      setUpdating(false);
    }
  };

  const updateQuantity = (productId, quantity) => 
    handleCartAction(() => API.put(`/cart/${productId}`, { quantity }));

  const removeItem = (productId) => 
    handleCartAction(() => API.delete(`/cart/${productId}`));

  const clearCart = () => 
    handleCartAction(() => API.delete('/cart'));

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
  );

  if (loading) return <LoadingSpinner fullPage />;

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h3>Debes iniciar sesión para ver tu carrito</h3>
        <Link to="/login" className="btn btn-primary mt-3">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 text-center text-danger">
        <h4>Error al cargar carrito</h4>
        <p>{error}</p>
        <button 
          onClick={fetchCartData}
          className="btn btn-primary mt-3"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Tu Carrito</h1>
        {cartCount > 0 && (
          <span className="badge bg-primary rounded-pill">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>
       {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <FaShoppingCart size={48} className="mb-3 text-muted" />
          <h4>Tu carrito está vacío</h4>
          <Link to="/products" className="btn btn-primary mt-3">
            Explorar Productos
          </Link>
        </div>
      ) : (
        // eslint-disable-next-line
        <>
          <div className="row">
            <div className="col-lg-8">
              {cartItems.map(item => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  onUpdate={updateQuantity}
                  onRemove={removeItem}
                  disabled={updating}
                />
              ))}
              
              <div className="text-end mb-3">
                <button 
                  onClick={clearCart}
                  disabled={updating}
                  className="btn btn-outline-danger"
                >
                  {updating ? 'Procesando...' : 'Vaciar Carrito'}
                </button>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="card shadow-sm sticky-top" style={{top: '20px'}}>
                <div className="card-body">
                  <h5 className="card-title">Resumen del Pedido</h5>
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span>Envío:</span>
                    <span>Gratis</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between fw-bold mb-4">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <Link 
                    to="/checkout" 
                    className="btn btn-primary w-100"
                    disabled={updating}
                  >
                    {updating ? 'Procesando...' : 'Proceder al Pago'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;