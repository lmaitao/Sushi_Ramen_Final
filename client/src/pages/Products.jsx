import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/products/ProductCard';
import CategoryFilter from '../components/products/CategoryFilter';
import SearchBar from '../components/products/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/products', {
          params: { category, search }
        });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-md-6">
          <h1>Nuestro Menú</h1>
        </div>
        <div className="col-md-6">
          <SearchBar />
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-12">
          <CategoryFilter />
        </div>
      </div>

      <div className="row">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <h4>No se encontraron productos</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;