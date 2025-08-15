import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'normal', color = 'primary', fullPage = false }) => {
  const sizeClass = size === 'small' ? 'spinner-border-sm' : '';
  const colorClass = color === 'light' ? 'text-light' : `text-${color}`;
  
  return (
    <div className={`d-flex justify-content-center align-items-center ${
      fullPage ? 'vh-100' : ''
    }`}>
      <div
        className={`spinner-border ${sizeClass} ${colorClass}`} 
        role="status"
      >
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['normal', 'small']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  fullPage: PropTypes.bool
};

export default LoadingSpinner;