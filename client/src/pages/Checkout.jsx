import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: 'credit_card',
    shippingAddress: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await API.post('/orders/checkout', formData);
      
      // Acceder a response.data.data en lugar de response.data
      const newOrderId = response.data?.data?.orderId;
      
      if (!newOrderId) {
        throw new Error('No se recibió el ID del pedido');
      }
      
      Swal.fire({
        icon: 'success',
        title: '¡Pedido realizado!',
        text: `Tu pedido #${newOrderId} ha sido creado exitosamente`,
        confirmButtonText: 'Ver mis pedidos'
      }).then(() => {
        //Redirigir directamente al detalle del pedido
        navigate(`/orders/${newOrderId}`);
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.error || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="mb-4">Finalizar Compra</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Método de Pago</h5>
                
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="credit_card"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label" htmlFor="credit_card">
                    Tarjeta de Crédito
                  </label>
                </div>
                
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="paypal"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="paypal">
                    PayPal
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cash"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="cash">
                    Efectivo al recibir
                  </label>
                </div>
              </div>
            </div>
            
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Dirección de Envío</h5>
                
                <div className="mb-3">
                  <label htmlFor="shippingAddress" className="form-label">
                    Dirección Completa *
                  </label>
                  <textarea
                    className="form-control"
                    id="shippingAddress"
                    name="shippingAddress"
                    rows="3"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    rows="2"
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner small light />
                ) : (
                  'Confirmar Pedido'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;