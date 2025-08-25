import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductReviews from '../components/reviews/ProductReviews';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import PropTypes from 'prop-types';


const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentFavoriteStatus, setCurrentFavoriteStatus] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        
        if (user && data) {
          const favStatus = isFavorite(data.id);
          setCurrentFavoriteStatus(favStatus);
        }
      } catch (error) {
        toast.error('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, isFavorite]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar a favoritos');
      return;
    }

    try {
      const result = await toggleFavorite(product.id);
      setCurrentFavoriteStatus(result.isFavorite);
      toast.success(
        result.isFavorite 
          ? 'Producto agregado a favoritos' 
          : 'Producto eliminado de favoritos'
      );
    } catch (error) {
      toast.error(error.message || 'Error al actualizar favoritos');
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar al carrito');
      return;
    }

    try {
      await API.post('/cart', { 
        productId: product.id, 
        quantity: Math.min(quantity, product.stock)
      });
      toast.success('Producto agregado al carrito');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al agregar al carrito');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!product) return <div className="container my-5">Producto no encontrado</div>;

  const price = (Number(product?.price) || 0).toFixed(2);
  const ratingAverage = product.ratings?.average || 0;
  const ratingCount = product.ratings?.count || 0;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-6">
          <div className="card shadow-sm mb-4">
            <img 
              src={product.image_url} 
              className="card-img-top product-detail-image" 
              alt={product.name}
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h1>{product.name}</h1>
            <button 
              onClick={handleToggleFavorite}
              className="btn btn-link p-0"
              aria-label={currentFavoriteStatus ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {currentFavoriteStatus ? (
                <FaHeart className="text-danger fs-3" />
              ) : (
                <FaRegHeart className="text-secondary fs-3" />
              )}
            </button>
          </div>
          
          <div className="d-flex align-items-center mb-3">
            <div className="me-2">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < Math.floor(ratingAverage) ? 'text-warning' : 'text-secondary'} 
                />
              ))}
            </div>
            <span className="text-muted">({ratingCount} reseñas)</span>
          </div>
          
          <h3 className="text-primary mb-4">${price}</h3>
          
          <div className="mb-4">
            <div className="btn-group" role="group">
              <button
                className={`btn ${
                  activeTab === 'description' ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Descripción
              </button>
              <button
                className={`btn ${
                  activeTab === 'reviews' ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reseñas
              </button>
            </div>
          </div>
          
          {activeTab === 'description' ? (
            <div className="mb-4">
              <p>{product.description}</p>
              <p className="text-muted">
                <strong>Categoría:</strong> {product.category}
              </p>
              <p className="text-muted">
                <strong>Disponibilidad:</strong> {product.stock > 0 ? 'En stock' : 'Agotado'}
              </p>
            </div>
          ) : (
            <ProductReviews productId={product.id} />
          )}
          
          <div className="d-flex align-items-center mb-4">
            <div className="me-3">
              <label htmlFor="quantity" className="form-label me-2">
                Cantidad:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock || 10}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 10, e.target.value)))}
                className="form-control d-inline-block"
                style={{ width: '70px' }}
                disabled={product.stock <= 0}
              />
            </div>
            
            <button 
              onClick={addToCart}
              className="btn btn-primary"
              disabled={product.stock <= 0}
              aria-label="Añadir al carrito"
            >
              <FaShoppingCart className="me-2" />
              {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
            </button>
          </div>
          <Link to="/products" className="btn btn-secondary">
                  Volver
                </Link>
        </div>
      </div>
    </div>
  );
};

ProductDetails.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image_url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string,
    stock: PropTypes.number,
    ratings: PropTypes.shape({
      average: PropTypes.number,
      count: PropTypes.number
    })
  })
};

export default ProductDetails;