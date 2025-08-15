import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Añadir método isCancel
API.isCancel = axios.isCancel;

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (API.isCancel(error)) {
      return Promise.reject({ 
        isCanceled: true,
        message: 'Request canceled' 
      });
    }

    // Manejar error 401 (No autorizado)
    if (error.response?.status === 401) {
      // No limpiar localStorage aquí para evitar loops
      // Solo despacha evento para que AuthContext maneje
      if (!error.config.url.includes('/auth/')) {
        window.dispatchEvent(new Event('unauthorized'));
      }
    }

    return Promise.reject(error);
  }
);

export default API;