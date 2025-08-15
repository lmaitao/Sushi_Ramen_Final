import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const FavoriteButton = ({ productId }) => {
  const { favorites, toggleFavorite, loading } = useFavorites();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const isFavorite = favorites.some(fav => fav.id === productId);

  const handleToggle = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para gestionar favoritos');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await toggleFavorite(productId);
      toast.success(result.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar favoritos');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading || isProcessing}
      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {isFavorite ? '❤️' : '🤍'}
      {isProcessing && <span className="spinner-border spinner-border-sm ms-1"></span>}
    </button>
  );
};

export default FavoriteButton;