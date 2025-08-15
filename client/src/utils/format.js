/**
 * Formatea un valor numérico a precio con 2 decimales.
 * @param {number|string} value - Valor a formatear.
 * @returns {string} Precio formateado (ej: "$12.50").
 */
export const formatPrice = (value) => {
  const number = Number(value || 0);
  return isNaN(number) ? '$0.00' : `$${number.toFixed(2)}`;
};

/**
 * Parsea y formatea un string de fecha a un formato local legible.
 * @param {string} dateInput - El string de fecha que viene de la API.
 * @returns {string} Fecha formateada o un mensaje de error.
 */
export const formatDate = (dateInput) => {
  if (!dateInput) {
    return 'Fecha no disponible';
  }

  let date;

  const parts = dateInput.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
  if (parts) {
    date = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }
  
  return date.toLocaleString('es-ES', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};