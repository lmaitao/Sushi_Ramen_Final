-- Crear DataBase
CREATE DATABASE sushi_ramen;

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
  image_url VARCHAR(350) NOT NULL,
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

-- -----------------------------------------------------------
-- INSERCIÓN DE DATOS INICIALES
-- -----------------------------------------------------------

-- Insertar datos de usuarios pass:123456
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@sushi.com', '$2a$12$1nCGoOamCtA4tefcBg7RiuomfoPy1S8FOMmM2WNgXcG.sCRqmgaRu', 'admin');

-- Insertar productos

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
('Sushi Nigiri Salmón', 'Salmón fresco sobre arroz sazonado, 2 piezas.', 2500, 'sushi', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 50),
('Sushi Nigiri Atún', 'Atún rojo sobre arroz, 2 piezas.', 2600, 'sushi', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 45),
('Sushi Roll California', 'Roll con palta, kanikama y pepino, 8 piezas.', 5200, 'sushi', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 60),
('Sushi Roll Tempura', 'Roll frito con camarón, queso crema y cebollín.', 5800, 'sushi', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 40),
('Sushi Vegano', 'Roll con tofu, palta, zanahoria y pepino.', 4900, 'sushi', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 35),
('Ramen Tonkotsu', 'Caldo de cerdo, fideos, huevo, cebollín y chashu.', 8900, 'ramen', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 30),
('Ramen Shoyu', 'Caldo de soya, fideos, alga nori, huevo y cerdo.', 8500, 'ramen', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 25),
('Ramen Miso', 'Caldo de miso, maíz, mantequilla, fideos y cerdo.', 8700, 'ramen', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 20),
('Ramen Vegano', 'Caldo vegetal, tofu, fideos, cebollín y champiñones.', 8200, 'ramen', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 15),
('Gyozas de Cerdo', 'Empanadillas japonesas rellenas de cerdo, 5 unidades.', 4200, 'entradas', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 40),
('Edamame', 'Porción de porotos de soya al vapor con sal.', 2900, 'entradas', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 50),
('Takoyaki', 'Bolitas de pulpo con salsa okonomiyaki y mayonesa.', 4800, 'entradas', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 30),
('Tempura de Verduras', 'Verduras frescas fritas en tempura.', 3900, 'entradas', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 35),
('Té Verde Frío', 'Té verde japonés frío sin azúcar.', 1800, 'bebidas', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 100),
('Ramune Original', 'Bebida japonesa con gas, sabor tradicional.', 2500, 'bebidas', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 80),
('Agua Mineral', 'Botella de agua mineral sin gas.', 1200, 'bebidas', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 120),
('Cerveza Japonesa', 'Cerveza importada estilo lager.', 3500, 'bebidas', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 60),
('Mochi de Té Verde', 'Masa de arroz rellena con helado de matcha.', 3200, 'postres', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 40),
('Dorayaki', 'Panqueques rellenos con pasta de porotos dulces.', 2800, 'postres', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 35),
('Helado de Sésamo Negro', 'Helado artesanal con sabor a sésamo negro.', 3500, 'postres', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 30),
('Cheesecake de Matcha', 'Tarta de queso con té verde japonés.', 3900, 'postres', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 25),
('Combo Sushi & Ramen', '6 piezas de sushi + ramen a elección.', 11900, 'combos', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 20),
('Combo Pareja', '12 piezas de sushi + 2 bebidas + 2 postres.', 15900, 'combos', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 15),
('Combo Familiar', '20 piezas de sushi + 2 ramen + 4 bebidas.', 22900, 'combos', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 10),
('Combo Vegano', 'Sushi vegano + ramen vegano + bebida.', 10900, 'combos', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 12);
('Sushi Roll Dragón', 'Roll con camarón tempura, palta y salsa unagi.', 6200, 'sushi', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 40),
('Sushi Roll Spicy Tuna', 'Atún picante, cebollín y sésamo, 8 piezas.', 5900, 'sushi', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 35),
('Sushi Roll Philadelphia', 'Salmón, queso crema y palta, 8 piezas.', 6100, 'sushi', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 50),
('Ramen Picante', 'Caldo miso picante, cerdo, huevo y negi.', 8900, 'ramen', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 25),
('Ramen Curry Japonés', 'Caldo de curry suave, fideos y pollo.', 8700, 'ramen', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 20),
('Ramen Frío (Hiyashi Chuka)', 'Fideos fríos con vegetales y salsa de sésamo.', 8200, 'ramen', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 15),
('Tártaro de Salmón', 'Salmón fresco con palta, cebollín y sésamo.', 4800, 'entradas', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 30),
('Ceviche Nikkei', 'Pescado blanco con limón, ají y cilantro.', 4900, 'entradas', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 25),
('Camaron Tempura', 'Camarones fritos en tempura, 5 unidades.', 5200, 'entradas', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 40),
('Té Matcha Latte', 'Té verde matcha con leche vegetal.', 2800, 'bebidas', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 60),
('Soda Japonesa Yuzu', 'Refresco cítrico japonés con gas.', 2600, 'bebidas', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 70),
('Limonada con Jengibre', 'Refrescante mezcla de limón y jengibre.', 2400, 'bebidas', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 80),
('Mochi de Frutilla', 'Masa de arroz rellena con helado de frutilla.', 3200, 'postres', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 35),
('Helado de Té Matcha', 'Helado artesanal de matcha japonés.', 3500, 'postres', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 30),
('Brownie con Helado', 'Brownie tibio con bola de helado de vainilla.', 3900, 'postres', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 25),
('Combo Ejecutivo', 'Ramen + bebida + postre.', 10900, 'combos', 'https://images.unsplash.com/photo-1606788075761-6c7c4b3e3c3f', 20),
('Combo Sushi Lovers', '16 piezas de sushi + bebida.', 13900, 'combos', 'https://images.unsplash.com/photo-1604908177522-472c7f3e3c2f', 15),
('Combo Deluxe', 'Ramen + 8 piezas sushi + postre + bebida.', 16900, 'combos', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f', 10);
