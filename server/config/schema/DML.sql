-- Crear DataBase
CREATE DATABASE IF NOT EXISTS sushi_ramen;

-- -----------------------------------------------------------
-- TABLAS
-- -----------------------------------------------------------

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

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tracking_number VARCHAR(100),
  shipping_carrier VARCHAR(50),
  transaction_id VARCHAR(100),
  payment_status VARCHAR(50),
  notes TEXT
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

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para historial de estados
CREATE TABLE IF NOT EXISTS order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- -----------------------------------------------------------
-- ÍNDICES PARA MEJORAR EL RENDIMIENTO
-- -----------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_product ON favorites(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- -----------------------------------------------------------
-- INSERCIÓN DE DATOS INICIALES
-- -----------------------------------------------------------

-- Insertar datos de usuarios
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@sushi.com', '$2a$10$X8z5ZJv5UJ5ZJv5UJ5ZJvOe5ZJv5UJ5ZJv5UJ5ZJv5UJ5ZJv5UJ5ZJv', 'admin'),
('Usuario', 'user@sushi.com', '$2a$10$X8z5ZJv5UJ5ZJv5UJ5ZJvOe5ZJv5UJ5ZJv5UJ5ZJv5UJ5ZJv5UJ5ZJv', 'user');

-- Insertar más productos
INSERT INTO products (name, description, price, category, image_url, stock) VALUES
-- Sushi
('California Roll', '8 piezas de sushi con surimi, aguacate y pepino, cubierto con masago', 11.50, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 50),
('Spicy Tuna Roll', '8 piezas de sushi con atún picante y pepino', 13.75, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 40),
('Ebi Tempura Roll', '8 piezas de sushi con camarón tempura, aguacate y salsa unagi', 14.25, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 35),
('Unagi Roll', '8 piezas de sushi con anguila a la parrilla y aguacate', 17.00, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 25),
('Rainbow Roll', '8 piezas de sushi con salmón, atún y aguacate', 16.50, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 30),
('Vegetable Roll', '8 piezas de sushi con aguacate, pepino, zanahoria y espárragos', 10.50, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 45),
('Salmon Nigiri', '2 piezas de nigiri con salmón fresco', 5.75, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 60),
('Tuna Nigiri', '2 piezas de nigiri con atún fresco', 6.25, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 55),
('Yellowtail Nigiri', '2 piezas de nigiri con cola amarilla', 6.50, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 30),
('Sashimi Platter', '15 piezas de sashimi variado (salmón, atún, pez mantequilla, pulpo)', 28.00, 'sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 20),

-- Ramen
('Miso Ramen', 'Ramen con caldo de miso, cerdo chashu, huevo y vegetales', 12.99, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 30),
('Shoyu Ramen', 'Ramen con caldo de soya, cerdo chashu, huevo y vegetales', 12.99, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 30),
('Tonkotsu Ramen', 'Ramen con caldo de hueso de cerdo, cerdo chashu, huevo y vegetales', 14.99, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 25),
('Spicy Ramen', 'Ramen con caldo picante, cerdo chashu, huevo y vegetales', 13.99, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 25),
('Vegetarian Ramen', 'Ramen con caldo vegetal, tofu, huevo y vegetales', 11.99, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 20),
('Seafood Ramen', 'Ramen con mariscos, caldo de miso y vegetales', 16.50, 'ramen', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 15),

-- Entradas
('Gyozas', '6 piezas de gyozas de cerdo y vegetales', 6.99, 'entradas', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', 40),
('Edamame', 'Vainas de soya con sal marina', 4.99, 'entradas', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', 50),
('Tempura Mixta', 'Tempura de camarón y vegetales', 8.99, 'entradas', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', 30),
('Karaage', 'Pollo frito al estilo japonés', 7.50, 'entradas', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', 35),
('Tako-yaki', 'Bolitas de pulpo fritas, 6 piezas', 9.00, 'entradas', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398', 25),

-- Bebidas
('Té Verde', 'Té verde japonés caliente', 2.99, 'bebidas', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 100),
('Cerveza Sapporo', 'Cerveza japonesa Sapporo 330ml', 5.99, 'bebidas', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 80),
('Sake', 'Sake premium, 180ml', 8.50, 'bebidas', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 60),
('Agua', 'Botella de agua', 1.99, 'bebidas', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 150),
('Refresco de Matcha', 'Refresco de té verde Matcha', 4.50, 'bebidas', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 70),

-- Postres
('Mochi Ice Cream', '3 bolas de helado mochi (fresa, té verde, vainilla)', 5.99, 'postres', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 40),
('Dorayaki', 'Panqueque japonés relleno de anko (pasta de frijol rojo)', 4.99, 'postres', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 30),
('Matcha Cheesecake', 'Cheesecake de té verde japonés', 7.50, 'postres', 'https://images.unsplash.com/photo-1560343090-f0409e92791a', 20),

-- Combos
('Ramen + Gyoza Combo', '1 Ramen a elección + 3 gyozas', 16.99, 'combos', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 20),
('Sushi & Ramen Combo', '8 piezas de sushi a elección + 1 ramen a elección', 24.99, 'combos', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 15),
('Family Sushi Platter', '32 piezas de sushi variado, 8 piezas de nigiri y 2 sopas miso', 49.99, 'combos', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 10),
('Vegetarian Delight', '8 piezas de sushi vegetariano + Ramen vegetariano + Edamame', 25.50, 'combos', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 12);