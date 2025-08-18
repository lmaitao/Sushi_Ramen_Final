import request from 'supertest';
import app from '../server.js';
import  pool from '../config/db/db.js';

describe('Products API', () => {
  let authToken;
  let productId;

  beforeAll(async () => {
    // Login para obtener token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@sushi.com',
        password: '123456'
      });
    
    authToken = res.body.token;

    // Crear un producto de prueba
    const productRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Product',
        description: 'Test Description',
        price: 9.99,
        category: 'sushi',
        image_url: 'http://example.com/image.jpg',
        stock: 10
      });
    
    productId = productRes.body.id;
  });

  afterAll(async () => {
    // Limpiar la base de datos
    if (productId) {
      await pool.query('DELETE FROM products WHERE id = $1', [productId]);
    }
    await pool.end();
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const res = await request(app).get('/api/products');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should filter products by category', async () => {
      const res = await request(app).get('/api/products?category=sushi');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.every(p => p.category === 'sushi')).toBeTruthy();
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get a single product', async () => {
      const res = await request(app).get(`/api/products/${productId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', productId);
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/999999');
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product (admin only)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New Product',
          description: 'New Description',
          price: 12.99,
          category: 'ramen',
          image_url: 'http://example.com/new.jpg',
          stock: 5
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');

      // Limpiar
      await pool.query('DELETE FROM products WHERE id = $1', [res.body.id]);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'New Product',
          description: 'New Description',
          price: 12.99,
          category: 'ramen',
          image_url: 'http://example.com/new.jpg',
          stock: 5
        });
      
      expect(res.statusCode).toEqual(401);
    });
  });
});