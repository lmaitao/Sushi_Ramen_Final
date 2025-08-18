import request from 'supertest';
import app from '../server.js';
import pool from '../config/db/db.js';

describe('Auth API', () => {
  beforeAll(async () => {
    // Crear un usuario de prueba
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ('Test User', 'test@example.com', '$2a$12$ykuGPMJuRbLLyuzaX3IKYeDQQNy90AEdORy4KNaubr8l6xpsNLog6', 'user')"
    );
  });

  afterAll(async () => {
    // Limpiar la base de datos
    await pool.query("DELETE FROM users WHERE email = 'test@example.com'");
    await pool.query("DELETE FROM users WHERE email = 'newuser@example.com'");
    await pool.end();
  });


  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
    });
  });

      it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com'
        });
      
      expect(res.statusCode).toEqual(400);
    });

    it('should fail with existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
    });

    describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
    });


  });
});