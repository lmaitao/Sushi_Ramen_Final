import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link} from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../utils/format';

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const { data } = await API.get('/orders');
        
        if (data?.success) {
          // Almacena los pedidos directamente como vienen de la API.
          setOrders(data.data || []);
        } else {
          throw new Error(data?.error || 'Error al cargar pedidos');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
        toast.error('Error al cargar pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const { data } = await API.put(`/users/${user.id}`, {
        name: formData.name,
        email: formData.email
      });
      
      // Actualiza el usuario en el localStorage y en el contexto (si tu useAuth lo permite)
      // Nota: Si useAuth ya actualiza el usuario globalmente, esta línea de localStorage podría ser redundante.
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: formData.name,
        email: formData.email
      }));
      
      toast.success(data?.message || 'Perfil actualizado');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.error || 'Error al actualizar perfil');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    try {
      const { data } = await API.put(`/users/${user.id}/password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success(data?.message || 'Contraseña actualizada');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(error.response?.data?.error || 'Error al actualizar contraseña');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h3>Debes iniciar sesión para acceder a tu perfil</h3>
        <Link to="/login" className="btn btn-primary mt-3">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="avatar-placeholder bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                  style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <h4>{user.name}</h4>
              <p className="text-muted">{user.email}</p>
              
              <div className="list-group mt-3">
                <button
                  className={`list-group-item list-group-item-action ${
                    activeTab === 'profile' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  Perfil
                </button>
                <button
                  className={`list-group-item list-group-item-action ${
                    activeTab === 'password' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('password')}
                >
                  Cambiar Contraseña
                </button>
                <button
                  className={`list-group-item list-group-item-action ${
                    activeTab === 'orders' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  Mis Pedidos
                </button>
                
                {/* CLAVE: Botón "Panel Admin" visible solo para administradores */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="list-group-item list-group-item-action list-group-item-warning"
                  >
                    Panel Admin
                  </Link>
                )}

                <button
                  className="list-group-item list-group-item-action text-danger"
                  onClick={logout}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          {activeTab === 'profile' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-4">Editar Perfil</h4>
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {activeTab === 'password' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-4">Cambiar Contraseña</h4>
                
                <form onSubmit={handlePasswordUpdate}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                      minLength="6"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength="6"
                    />
                  </div>
                  
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Cambiar Contraseña
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-4">Mis Pedidos</h4>
                
                {loading ? (
                  <LoadingSpinner />
                ) : error ? (
                  <div className="alert alert-danger">
                    {error}
                    <button 
                      className="btn btn-sm btn-outline-secondary ms-3"
                      onClick={() => window.location.reload()}
                    >
                      Reintentar
                    </button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No tienes pedidos realizados aún</p>
                    <Link to="/products" className="btn btn-primary mt-2">
                      Ver Productos
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
                            <td>{formatPrice(order.total)}</td>
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
                                Detalles
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
