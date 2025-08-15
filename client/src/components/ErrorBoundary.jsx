import { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
  state = { 
    hasError: false, 
    error: null,
    errorInfo: null 
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Error Boundary caught:", error, errorInfo);
    // Puedes agregar aquí el envío de errores a un servicio como Sentry
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container my-5 py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <FaExclamationTriangle className="text-danger mb-3" size={48} />
              <h2 className="text-danger mb-3">¡Ups! Algo salió mal</h2>
              <p className="lead mb-4">
                Hemos encontrado un problema al cargar esta página.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-light rounded text-start">
                  <details className="mb-3">
                    <summary>Detalles del error (solo desarrollo)</summary>
                    <p className="text-danger mt-2">{this.state.error?.toString()}</p>
                    <pre className="text-muted small overflow-auto">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                </div>
              )}

              <div className="d-flex justify-content-center gap-3">
                <button 
                  onClick={this.handleReset}
                  className="btn btn-primary"
                >
                  Recargar Página
                </button>
                <Link to="/" className="btn btn-outline-primary">
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;