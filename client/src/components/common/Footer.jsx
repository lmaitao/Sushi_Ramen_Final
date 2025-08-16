import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer bg-dark text-light py-5">
      <div className="container">
        <div className="row g-4 justify-content-center">
          
          <div className="col-xl-4 col-lg-5 col-md-6 text-center">
            <div className="footer-about mx-auto" style={{maxWidth: '300px'}}>
              <h4 className="text-uppercase mb-3 fw-bold text-white">SUSHI & RAMEN</h4>
              <p className="mb-4" style={{color: '#cccccc'}}>
                Ofrecemos los mejores sabores de la cocina japonesa con ingredientes frescos y de alta calidad.
              </p>
              
              <div className="d-flex justify-content-center gap-4 mb-4">
                <a href="https://www.facebook.com/" 
                   className="text-white"
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Facebook">
                  <FaFacebook size={28} />
                </a>
                <a href="https://www.instagram.com/" 
                   className="text-white"
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Instagram">
                  <FaInstagram size={28} />
                </a>
                <a href="https://twitter.com/" 
                   className="text-white"
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Twitter">
                  <FaTwitter size={28} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-lg-4 col-md-6 text-center">
            <div className="mx-auto" style={{maxWidth: '250px'}}>
              <h5 className="text-uppercase mb-3 fw-bold text-white">HORARIO</h5>
              <ul className="list-unstyled" style={{color: '#cccccc'}}>
                <li className="mb-2">Lunes - Viernes: 11:00 - 22:00</li>
                <li className="mb-2">Sábado: 11:00 - 23:00</li>
                <li className="mb-2">Domingo: 12:00 - 21:00</li>
              </ul>
            </div>
          </div>
          
          <div className="col-xl-3 col-lg-4 col-md-6 text-center">
            <div className="mx-auto" style={{maxWidth: '250px'}}>
              <h5 className="text-uppercase mb-3 fw-bold text-white">CONTACTO</h5>
              <ul className="list-unstyled" style={{color: '#cccccc'}}>
                <li className="d-flex justify-content-center align-items-start mb-3">
                  <FaMapMarkerAlt className="me-2 mt-1 flex-shrink-0 text-white" size={20} />
                  <span>Av.Vicuña Mackenna 1281, Santiago de Chile.</span>
                </li>
                <li className="d-flex justify-content-center align-items-center mb-3">
                  <FaPhone className="me-2 flex-shrink-0 text-white" size={20} />
                  <span>+56 927 016 426</span>
                </li>
                <li className="d-flex justify-content-center align-items-center mb-3">
                  <FaEnvelope className="me-2 flex-shrink-0 text-white" size={20} />
                  <span>info@sushiramen.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <hr className="my-4 mx-auto bg-light opacity-75" style={{maxWidth: '80%'}} />
        
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 small" style={{color: '#aaaaaa'}}>
              &copy; {currentYear} Sushi & Ramen. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;