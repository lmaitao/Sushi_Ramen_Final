import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import API from '../../services/api';
import { toast } from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaShoppingCart, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const [isLoading, setIsLoading] = useState({
    cart: false,
    favorite: false
  });

  if (!product || !product.id) {
    return (
      <div className="card h-100 shadow-sm">
        <div className="card-body text-center text-danger">
          <p>Error al cargar el producto</p>
        </div>
      </div>
    );
  }

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Inicia sesión para gestionar favoritos');
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, favorite: true }));
      await toggleFavorite(product.id);
    } catch (error) {
      toast.error(error.message || 'Error al actualizar favoritos');
    } finally {
      setIsLoading(prev => ({ ...prev, favorite: false }));
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Inicia sesión para agregar al carrito');
      return;
    }

    setIsLoading(prev => ({ ...prev, cart: true }));
    try {
      await API.post('/cart', { productId: product.id, quantity: 1 });
      toast.success('Producto agregado al carrito');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al agregar al carrito');
    } finally {
      setIsLoading(prev => ({ ...prev, cart: false }));
    }
  };

  const isLoadingState = isLoading.cart || isLoading.favorite || favoritesLoading;
  const price = (Number(product?.price) || 0).toFixed(2);

  return (
    <motion.div 
      className="card h-100 shadow-sm position-relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {isLoadingState && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-light bg-opacity-50 z-index-1">
          <FaSpinner className="fa-spin text-primary" size={24} />
        </div>
      )}

      <Link to={`/products/${product.id}`} className="text-decoration-none">
        <motion.img
          src={product.image_url || '/images/placeholder-product.png'}
          className="card-img-top object-fit-cover"
          alt={product.name}
          style={{ height: '180px' }}
          loading="lazy"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </Link>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 flex-grow-1 pe-2">
            <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
              {product.name}
            </Link>
          </h5>
          
          <motion.button
            onClick={handleFavorite}
            disabled={isLoadingState}
            className="btn btn-link p-0 border-0 align-self-start"
            aria-label={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            whileTap={{ scale: 0.9 }}
          >
            {isFavorite(product.id) ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <FaHeart className="text-danger" size={20} />
              </motion.div>
            ) : (
              <FaRegHeart className="text-muted" size={20} />
            )}
          </motion.button>
        </div>

        {product.category && (
          <span className="badge bg-light text-dark mb-2 align-self-start">
            {product.category}
          </span>
        )}

        {product.description && (
          <p className="card-text text-muted small mb-3" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description}
          </p>
        )}

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="h5 text-primary mb-0">${price}</span>
          
          <motion.button
            onClick={handleAddToCart}
            disabled={isLoadingState}
            className="btn btn-sm btn-primary d-flex align-items-center"
            aria-label="Añadir al carrito"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaShoppingCart className="me-1" />
            <span>Añadir</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image_url: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    stock: PropTypes.number
  }).isRequired
};

export default ProductCard;