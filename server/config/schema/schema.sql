--Crear DataBase
CREATE DATABASE IF NOT EXISTS sushi_ramen;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de carrito
CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id) 
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_product ON favorites(user_id, product_id);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items de pedido
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices recomendados
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- Campos adicionales para shipping y payment
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_carrier VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50);

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Tabla para historial de estados
CREATE TABLE order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar datos iniciales
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@sushi.com', '$2a$10$X8z5ZJv5UJ5ZJv5UJ5ZJvOe5ZJv5UJ5ZJv5UJ5ZJv5UJ5ZJv5UJ5ZJv', 'admin'),
('Usuario', 'user@sushi.com', '$2a$10$X8z5ZJv5UJ5ZJv5UJ5ZJvOe5ZJv5UJ5ZJv5UJ5ZJv5UJ5ZJv5UJ5ZJv', 'user');

-- Insertar productos de sushi
INSERT INTO products (name, description, price, category, image_url, stock) VALUES
('Sushi Roll Clásico', '8 piezas de sushi roll con salmón, pepino y aguacate', 12.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 50),
('Sushi Roll Picante', '8 piezas de sushi roll con atún picante y mayonesa', 14.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 40),
('Sushi Vegetariano', '8 piezas de sushi roll con zanahoria, pepino y aguacate', 11.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 30),
('Sushi Roll Tempura', '8 piezas de sushi roll con camarón tempura y aguacate', 15.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 35),
('Sushi Roll Dragon', '8 piezas de sushi roll con anguila y pepino, cubierto con aguacate', 16.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 25),
('Sushi Roll Philadelphia', '8 piezas de sushi roll con salmón, queso crema y pepino', 13.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 45),
('Sushi Nigiri Salmón', '4 piezas de nigiri con salmón fresco', 10.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 40),
('Sushi Nigiri Atún', '4 piezas de nigiri con atún fresco', 11.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 35),
('Sashimi Mix', '12 piezas de sashimi variado (salmón, atún, pez mantequilla)', 22.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 20),
('Combo Sushi Deluxe', '16 piezas de sushi variado, 4 piezas de nigiri y sopa miso', 29.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 15),
('Combo Sushi Familiar', '32 piezas de sushi variado, 8 piezas de nigiri y 2 sopas miso', 49.99, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 10),
('Ramen Miso', 'Ramen con caldo de miso, cerdo chashu, huevo y vegetales', 12.99, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 30),
('Ramen Shoyu', 'Ramen con caldo de soya, cerdo chashu, huevo y vegetales', 12.99, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 30),
('Ramen Tonkotsu', 'Ramen con caldo de hueso de cerdo, cerdo chashu, huevo y vegetales', 14.99, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 25),
('Ramen Picante', 'Ramen con caldo picante, cerdo chashu, huevo y vegetales', 13.99, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 25),
('Ramen Vegetariano', 'Ramen con caldo vegetal, tofu, huevo y vegetales', 11.99, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 20),
('Gyozas', '6 piezas de gyozas de cerdo y vegetales', 6.99, 'entradas', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', 40),
('Edamame', 'Vainas de soya con sal marina', 4.99, 'entradas', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', 50),
('Tempura Mixta', 'Tempura de camarón y vegetales', 8.99, 'entradas', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', 30),
('Té Verde', 'Té verde japonés caliente', 2.99, 'bebidas', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 100),
('Cerveza Sapporo', 'Cerveza japonesa Sapporo 330ml', 5.99, 'bebidas', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 80),
('Refresco Japonés', 'Refresco japonés de melón o uva 250ml', 3.99, 'bebidas', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 90),
('Mochi', '3 piezas de mochi (chocolate, fresa, mango)', 5.99, 'postres', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 40),
('Dorayaki', 'Panqueque japonés relleno de anko (pasta de frijol rojo)', 4.99, 'postres', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 30),
('Combo Ramen + Gyoza', '1 Ramen a elección + 3 gyozas', 16.99, 'combos', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 20),
('Combo Sushi + Ramen', '8 piezas de sushi + 1 ramen a elección', 24.99, 'combos', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 15),
('Combo Familiar', '32 piezas de sushi + 2 ramen + 6 gyozas + postre', 59.99, 'combos', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 10);

ALTER TABLE orders ADD COLUMN notes TEXT;

