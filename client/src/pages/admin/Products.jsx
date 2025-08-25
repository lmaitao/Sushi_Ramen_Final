import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Modal, Button } from 'react-bootstrap';
import SearchBaradmin from '../../components/products/SearchBaradmin';

const AdminProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/products');
        setAllProducts(data);
      } catch (error) {
        toast.error('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async () => {
    try {
      await API.delete(`/admin/products/${productToDelete}`);
      setAllProducts(allProducts.filter(p => p.id !== productToDelete));
      toast.success('Producto eliminado');
    } catch (error) {
      toast.error('Error al eliminar producto');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())

  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
      <Link to="/admin" className="btn btn-secondary">
                  Volver
                </Link>
        <h1>Administrar Productos</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          Añadir Producto
        </Link>
      </div>
      
      <div className="mb-4">
        <SearchBaradmin />
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`badge ${
                      product.is_active ? 'bg-success' : 'bg-secondary'
                    }`}>
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <Link 
                      to={`/admin/products/edit/${product.id}`} 
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => confirmDelete(product.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No se encontraron productos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProducts;