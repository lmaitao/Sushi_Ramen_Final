import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await API.get('/products', {
          params: { category: 'combos' }
        });
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        toast.error('Error al cargar productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <section className="hero-section text-center text-white">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Delicioso Sushi & Ramen</h1>
          <p className="lead mb-5">
            Ingredientes frescos, preparados al momento con auténtico sabor japonés
          </p>
          <Link to="/products" className="btn btn-primary btn-lg px-4 me-2">
            Ver Menú
          </Link>
          <Link to="/about" className="btn btn-outline-light btn-lg px-4">
            Conócenos
          </Link>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3 text-primary">
                    <svg width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6zM6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13z"/>
                    </svg>
                  </div>
                  <h4>Ingredientes Frescos</h4>
                  <p className="text-muted">
                    Utilizamos solo los ingredientes más frescos y de la más alta calidad.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3 text-primary">
                    <svg width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5zm2.5 5a.5.5 0 0 0-1 0v3.5a.5.5 0 0 0 1 0V5.5z"/>
                    </svg>
                  </div>
                  <h4>Preparado al Momento</h4>
                  <p className="text-muted">
                    Cada plato se prepara al momento para garantizar la máxima frescura.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3 text-primary">
                    <svg width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                  </div>
                  <h4>Entrega Rápida</h4>
                  <p className="text-muted">
                    Entregamos tu pedido en el menor tiempo posible, manteniendo la calidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-md-8">
              <h2>Combos Destacados</h2>
              <p className="text-muted">
                Nuestros combos más populares para disfrutar en casa
              </p>
            </div>
            <div className="col-md-4 text-end">
              <Link to="/products" className="btn btn-outline-primary">
                Ver Todo
              </Link>
            </div>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="row">
              {featuredProducts.map(product => (
                <div key={product.id} className="col-lg-3 col-md-6 mb-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b" 
                className="img-fluid rounded shadow" 
                alt="Sushi fresco" 
              />
            </div>
            <div className="col-lg-6">
              <h2 className="mb-4">Auténtico Sabor Japonés</h2>
              <p className="lead">
                Nuestros chefs tienen años de experiencia preparando los platillos más auténticos de la cocina japonesa.
              </p>
              <p>
                Utilizamos técnicas tradicionales combinadas con ingredientes frescos para ofrecerte una experiencia culinaria única.
              </p>
              <Link to="/about" className="btn btn-primary mt-3">
                Conoce Nuestra Historia
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;