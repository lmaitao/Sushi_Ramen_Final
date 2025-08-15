import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { showErrorAlert } from '../utils/errorHandler';

// Crear el contexto de autenticación
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicializa el estado 'user' intentando cargar desde localStorage al inicio.
  // Esto permite que el usuario permanezca logueado al recargar la página.
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  // Estado para indicar si la autenticación inicial está en curso (al cargar la app)
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @function logout
   * @description Cierra la sesión del usuario. Primero limpia el estado local para una UI inmediata,
   * y luego notifica al backend para invalidar la sesión del lado del servidor.
   */
  const logout = useCallback(async () => {
    // 1. Limpiar el estado del cliente inmediatamente
    localStorage.removeItem('token'); // Elimina el token de acceso
    localStorage.removeItem('user');  // Elimina los datos del usuario
    setUser(null);                    // Establece el usuario a null en el estado de React
    // Elimina el token del encabezado por defecto de Axios para futuras peticiones
    API.defaults.headers.common['Authorization'] = null; 

    try {
      // 2. Intentar hacer logout en el backend.
      // Esta llamada es un "mejor esfuerzo" y puede fallar (ej. token ya expiró en el servidor),
      // pero el frontend ya habrá limpiado la sesión localmente.
      await API.post('/auth/logout');
    } catch (error) {
      // Este error se puede ignorar si la sesión en el cliente ya se cerró correctamente.
      console.error('Error en logout del backend (puede ignorarse si el cliente ya cerró la sesión):', error);
    }
  }, []); // Dependencia vacía porque logout no depende de estados mutables externamente

  /**
   * @function loadUser
   * @description Carga la información del usuario desde el backend usando el token almacenado en localStorage.
   * Se ejecuta al inicio de la aplicación para verificar y restaurar la sesión activa.
   */
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false); // No hay token, no hay usuario logueado, se termina la carga inicial.
      return;
    }

    try {
      setIsLoading(true); // Se inicia el estado de carga
      // Configura el token de autorización en el encabezado de Axios para todas las futuras peticiones
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Realiza la petición para obtener los datos completos del usuario actual
      const { data } = await API.get('/auth/me');
      setUser(data); // Actualiza el estado del usuario en el contexto
      localStorage.setItem('user', JSON.stringify(data)); // Persiste los datos completos del usuario en localStorage
      
      console.log('Usuario cargado correctamente:', data); // Depuración: verifica los datos del usuario cargado
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
      // Si el servidor responde con 401 (No autorizado), significa que el token no es válido o expiró.
      // En este caso, se cierra la sesión para limpiar cualquier estado inconsistente.
      if (error.response?.status === 401) {
        logout(); // Cierra la sesión automáticamente
      } else {
        showErrorAlert(error); // Muestra un error genérico al usuario
      }
    } finally {
      setIsLoading(false); // Finaliza el estado de carga, independientemente del resultado
    }
  }, [logout]); // Dependencia en 'logout' para asegurar que siempre se llame a la última versión

  /**
   * @function login
   * @description Maneja el proceso de inicio de sesión de un usuario.
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {boolean} - `true` si el inicio de sesión fue exitoso, `false` en caso contrario.
   */
  const login = async (email, password) => {
    try {
      setIsLoading(true); // Indica que el login está en progreso
      // Envía las credenciales al endpoint de login del backend
      const { data } = await API.post('/auth/login', { email, password });
      
      // Almacena el token de acceso y los datos del usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user); // Actualiza el estado del usuario en el contexto de React
      // Configura el token de autorización en el encabezado de Axios para todas las futuras peticiones
      API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      return true; // Inicio de sesión exitoso
    } catch (error) {
      showErrorAlert(error); // Muestra el error de la API (ej. credenciales inválidas) al usuario
      return false; // Fallo en el inicio de sesión
    } finally {
      setIsLoading(false); // Finaliza el estado de carga
    }
  };

  /**
   * @function register
   * @description Maneja el proceso de registro de un nuevo usuario.
   * @param {string} name - Nombre del usuario.
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {boolean} - `true` si el registro fue exitoso, `false` en caso contrario.
   */
  const register = async (name, email, password) => {
    try {
        setIsLoading(true); // Indica que el registro está en progreso
        // Envía los datos de registro al endpoint de registro del backend
        const { data } = await API.post('/auth/register', { name, email, password });
        
        // Almacena el token de acceso y los datos del usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user); // Actualiza el estado del usuario en el contexto de React
        // Configura el token de autorización en el encabezado de Axios para todas las futuras peticiones
        API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        return true; // Registro exitoso
    } catch (error) {
        showErrorAlert(error); // Muestra el error de la API al usuario
        return false; // Fallo en el registro
    } finally {
        setIsLoading(false); // Finaliza el estado de carga
    }
  };

  // Efecto que se ejecuta una vez al montar el componente AuthProvider.
  // Es crucial para cargar el usuario desde localStorage/backend y establecer el estado inicial de autenticación.
  useEffect(() => {
    loadUser();
  }, [loadUser]); // Se ejecuta cuando 'loadUser' cambia (que solo es al montar, gracias a useCallback)

  // El proveedor del contexto expone las funciones y estados a todos los componentes hijos envueltos.
  return (
    <AuthContext.Provider value={{
      user,      // Objeto de usuario autenticado (o null si no hay sesión)
      isLoading, // Indica si la autenticación inicial está en progreso
      login,     // Función para iniciar sesión
      logout,    // Función para cerrar sesión
      loadUser,  // Función para recargar los datos del usuario (útil para actualizar el perfil)
      register   // Función para registrar un nuevo usuario
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de autenticación fácilmente en cualquier componente.
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Lanza un error si useAuth se usa fuera de un AuthProvider, lo cual es incorrecto.
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
