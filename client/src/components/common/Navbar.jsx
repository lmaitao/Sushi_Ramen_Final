import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaShoppingCart, FaUser, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import API from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Navbar = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Cargar contadores del carrito y favoritos
  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) {
        setCartCount(0);
        setFavoritesCount(0);
        return;
      }

      setLoadingCounts(true);
      try {
        const [cartRes, favRes] = await Promise.all([
          API.get('/cart/count'),
          API.get('/favorites/count')
        ]);
        setCartCount(cartRes.data.count);
        setFavoritesCount(favRes.data.count);
      } catch (error) {
        console.error('Error loading counts:', error);
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchCounts();
  }, [user]);

  // Colapsar navbar al cambiar de ruta
  useEffect(() => {
    setIsNavCollapsed(true);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileNavigation = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setProfileLoading(true);
    try {
      // Verificar sesión antes de redirigir
      await API.get('/auth/verify');
      navigate('/profile');
    } catch (error) {
      console.error('Session verification failed:', error);
      await logout();
      navigate('/login', { state: { sessionExpired: true } });
    } finally {
      setProfileLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <span className="text-primary">Sushi</span> & Ramen
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}>
          <ul className="navbar-nav me-auto">
            <NavItem to="/" text="Inicio" />
            <NavItem to="/products" text="Menú" />
            <NavItem to="/about" text="Nosotros" />
            <NavItem to="/contact" text="Contacto" />
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <div className="d-flex align-items-center gap-2">
                  <NavIcon 
                    to="/favorites" 
                    icon={<FaHeart />} 
                    count={favoritesCount} 
                    loading={loadingCounts}
                    ariaLabel="Favoritos"
                  />
                  
                  <NavIcon 
                    to="/cart" 
                    icon={<FaShoppingCart />} 
                    count={cartCount} 
                    loading={loadingCounts}
                    ariaLabel="Carrito"
                  />
                </div>

                <div className="dropdown">
                  <button
                    className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                    onClick={handleProfileNavigation}
                    disabled={profileLoading}
                    aria-expanded="false"
                  >
                    {profileLoading ? (
                      <LoadingSpinner small light />
                    ) : (
                      <>
                        <FaUser className="me-2" />
                        {user.name.split(' ')[0]} {/* Muestra solo el primer nombre */}
                      </>
                    )}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <DropdownItem to="/profile" text="Mi Perfil" />
                    <DropdownItem to="/orders" text="Mis Pedidos" />
                    <DropdownItem to="/favorites" text="Favoritos" />
                    
                    {user.role === 'admin' && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <DropdownItem to="/admin" text="Panel Admin" />
                      </>
                    )}
                    
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="me-2" />
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn btn-outline-light"
                  state={{ from: location.pathname }}
                >
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Componentes auxiliares para mejor legibilidad
const NavItem = ({ to, text }) => (
  <li className="nav-item">
    <NavLink 
      className={({ isActive }) => 
        `nav-link ${isActive ? 'active fw-bold' : ''}`
      } 
      to={to}
    >
      {text}
    </NavLink>
  </li>
);

const NavIcon = ({ to, icon, count, loading, ariaLabel }) => (
  <Link 
    to={to} 
    className="position-relative btn btn-outline-light" 
    aria-label={ariaLabel}
  >
    {icon}
    {!loading && count > 0 && (
      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        {count}
      </span>
    )}
  </Link>
);

const DropdownItem = ({ to, text }) => (
  <li>
    <Link className="dropdown-item" to={to}>
      {text}
    </Link>
  </li>
);

export default Navbar;