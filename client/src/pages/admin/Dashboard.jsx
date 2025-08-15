import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Card, Row, Col, Table, Badge } from 'react-bootstrap';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (error) {
        toast.error('Error al cargar estadísticas');
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  if (!user || user.role !== 'admin') {
    return (
      <div className="container my-5 text-center">
        <h3>Acceso no autorizado</h3>
        <p>No tienes permisos para acceder a esta sección</p>
        <Link to="/" className="btn btn-primary mt-3">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Panel de Administración</h1>
        <Badge bg="primary" className="fs-6">
          Bienvenido, {user.name}
        </Badge>
      </div>
      
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Usuarios</Card.Title>
              <Card.Text className="display-6 text-primary">
                {stats.users}
              </Card.Text>
              <Card.Link as={Link} to="/admin/users" className="text-decoration-none">
                Ver Usuarios
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Productos</Card.Title>
              <Card.Text className="display-6 text-primary">
                {stats.products}
              </Card.Text>
              <Card.Link as={Link} to="/admin/products" className="text-decoration-none">
                Ver Productos
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Pedidos</Card.Title>
              <Card.Text className="display-6 text-primary">
                {stats.orders}
              </Card.Text>
              <Card.Link as={Link} to="/admin/orders" className="text-decoration-none">
                Ver Pedidos
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Ingresos</Card.Title>
              <Card.Text className="display-6 text-primary">
                ${stats.revenue.toFixed(2)}
              </Card.Text>
              <Card.Link as={Link} to="/admin/orders" className="text-decoration-none">
                Ver Detalles
              </Card.Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title className="mb-4">Pedidos Recientes</Card.Title>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user_name}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <Badge 
                        bg={
                          order.status === 'completed' ? 'success' :
                          // eslint-disable-next-line
                          order.status === 'cancelled' ? 'danger' :
                          'warning'
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <Link 
                        to={`/admin/orders/${order.id}`} 
                        className="btn btn-sm btn-outline-primary"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;