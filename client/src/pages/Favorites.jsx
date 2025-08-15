import { useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import { FaHeartBroken } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { favorites, loading, error, fetchFavorites } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando tus favoritos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center text-danger">
        <FaHeartBroken size={48} className="mb-3" />
        <h3>Error al cargar favoritos</h3>
        <p>{error}</p>
        <button 
          onClick={fetchFavorites}
          className="btn btn-primary mt-3"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0">
          <div className="card-body py-5">
            <h3 className="mb-3">Inicia sesión para ver tus favoritos</h3>
            <p className="text-muted mb-4">
              Guarda tus productos favoritos y accede a ellos fácilmente
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login" className="btn btn-primary px-4">
                Iniciar sesión
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0">
          <div className="card-body py-5">
            <FaHeartBroken size={48} className="mb-3 text-muted" />
            <h3 className="mb-3">Aún no tienes favoritos</h3>
            <p className="text-muted mb-4">
              Explora nuestros productos y agrega tus favoritos
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/products" className="btn btn-primary px-4">
                Ver productos
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="mb-0">Mis Favoritos</h1>
          <p className="text-muted">
            {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {favorites.map((product) => (
          <div key={product.id} className="col">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;