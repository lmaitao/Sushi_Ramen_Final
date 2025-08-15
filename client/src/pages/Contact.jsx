import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Mensaje enviado. ¡Gracias por contactarnos!');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-6 mb-4">
          <h1 className="mb-4">Contáctanos</h1>
          
          <div className="mb-4">
            <div className="d-flex align-items-start mb-3">
              <FaMapMarkerAlt className="text-primary mt-1 me-3" size={20} />
              <div>
                <h5>Dirección</h5>
                <p className="text-muted mb-0">
                  Av. Vicuña Mackenna 1281,Santiago De Chile.
                </p>
              </div>
            </div>
            
            <div className="d-flex align-items-start mb-3">
              <FaPhone className="text-primary mt-1 me-3" size={20} />
              <div>
                <h5>Teléfono</h5>
                <p className="text-muted mb-0">
                  +56 927 016 426
                </p>
              </div>
            </div>
            
            <div className="d-flex align-items-start mb-3">
              <FaEnvelope className="text-primary mt-1 me-3" size={20} />
              <div>
                <h5>Email</h5>
                <p className="text-muted mb-0">
                  info@sushiramen.com
                </p>
              </div>
            </div>
            
            <div className="d-flex align-items-start">
              <FaClock className="text-primary mt-1 me-3" size={20} />
              <div>
                <h5>Horario</h5>
                <p className="text-muted mb-0">
                  Lunes a Viernes: 11:00 - 22:00<br />
                  Sábados: 11:00 - 23:00<br />
                  Domingos: 12:00 - 21:00
                </p>
              </div>
            </div>
          </div>
          
          <div className="ratio ratio-16x9">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.6444390898873!2d-70.63215462572782!3d-33.45856889792537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c56427f95aa5%3A0x320ee14e31061066!2sAv.%20Vicu%C3%B1a%20Mackenna%201281%2C%208360052%20%C3%91u%C3%B1oa%2C%20Santiago%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1755131587570!5m2!1ses-419!2scl"
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Mapa de ubicación"
            ></iframe>
          </div>
        </div>
        
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Envíanos un mensaje</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Mensaje
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;