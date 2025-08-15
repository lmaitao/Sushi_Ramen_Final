import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Función para cargar favoritos
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get('/favorites');
      if (data?.success) {
        setFavorites(data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar favoritos');
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Función para alternar favoritos
  const toggleFavorite = useCallback(async (productId) => {
    try {
      setLoading(true);
      const { data } = await API.post('/favorites/toggle', { productId });
      if (data.success) {
        await fetchFavorites(); // Actualiza la lista después de cambiar
        return data;
      }
      throw new Error(data.error || 'Error al actualizar favoritos');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFavorites]);

  // Cargar favoritos al montar y cuando cambie el usuario
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      loading,
      error,
      fetchFavorites, // Asegúrate de exponer esta función
      toggleFavorite,
      isFavorite: (productId) => favorites.some(fav => fav.id === productId)
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }
  return context;
};