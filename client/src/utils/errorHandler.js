import Swal from 'sweetalert2';

export const handleApiError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        return {
          title: 'No autorizado',
          message: data?.error || 'Tu sesión ha expirado o no tienes permisos',
          action: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        };
      case 403:
        return {
          title: 'Acceso prohibido',
          message: data?.error || 'No tienes permisos para esta acción'
        };
      case 404:
        return {
          title: 'Recurso no encontrado',
          message: data?.error || 'El recurso solicitado no existe'
        };
      default:
        return {
          title: 'Error del servidor',
          message: data?.error || `Error ${status}: Ocurrió un problema en el servidor`
        };
    }
  } else if (error.request) {
    // La solicitud fue hecha pero no hubo respuesta
    return {
      title: 'Error de conexión',
      message: 'No se recibió respuesta del servidor'
    };
  } else {
    // Error al configurar la solicitud
    return {
      title: 'Error',
      message: error.message || 'Ocurrió un error desconocido'
    };
  }
};

export const showErrorAlert = (error) => {
  const { title, message, action } = handleApiError(error);
  Swal.fire({
    icon: 'error',
    title,
    text: message,
    willClose: action ? () => action() : undefined
  });
};