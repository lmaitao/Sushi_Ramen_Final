import { useState, useEffect } from 'react';
import API from '../services/api';

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/cart');
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await API.post('/cart', { productId, quantity });
      const { data } = await API.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  return { cart, loading, addToCart };
};

export default useCart;