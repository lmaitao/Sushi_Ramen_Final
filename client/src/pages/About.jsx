import { FaFish, FaLeaf, FaAward } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-6 mb-4">
          <h1 className="mb-4">Nuestra Historia</h1>
          <p className="lead">
            Desde 2025, Sushi & Ramen ha estado sirviendo auténtica cocina japonesa con un toque moderno.
          </p>
          <p>
            Todo comenzó como un pequeño local familiar con la pasión por compartir los sabores tradicionales de Japón.
            Hoy en día, seguimos manteniendo esa esencia mientras innovamos con nuevos platillos que deleitan a nuestros clientes.
          </p>
          <p>
            Nuestros chefs tienen más de 1 años de experiencia en la cocina japonesa y han entrenado en los mejores restaurantes de Tokio.
          </p>
        </div>
        <div className="col-lg-6 mb-4">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5" 
            alt="Nuestro restaurante" 
            className="img-fluid rounded shadow"
          />
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <FaFish className="text-primary mb-3" size={48} />
              <h4>Frescura Garantizada</h4>
              <p className="text-muted">
                Pesca del día y ingredientes importados directamente de Japón.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <FaLeaf className="text-primary mb-3" size={48} />
              <h4>Ingredientes Naturales</h4>
              <p className="text-muted">
                Sin conservantes ni aditivos artificiales en ninguno de nuestros platillos.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <FaAward className="text-primary mb-3" size={48} />
              <h4>Premiados</h4>
              <p className="text-muted">
                Ganadores del premio a la Excelencia Culinaria por 3 años consecutivos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;