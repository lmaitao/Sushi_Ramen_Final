import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showErrorAlert } from '../utils/errorHandler';

const GlobalErrorHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      showErrorAlert({ 
        response: { 
          status: 401,
          data: { error: 'Tu sesión ha expirado' }
        } 
      });
      navigate('/login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate]);

  return null;
};

export default GlobalErrorHandler;