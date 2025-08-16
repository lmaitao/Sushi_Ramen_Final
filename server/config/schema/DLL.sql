-- Consulta de carrrito por id
SELECT c.*, p.name, p.price, p.image_url FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1;

-- Verificar si el producto ya está en el carrito
SELECT * FROM cart WHERE user_id = $1 AND product_id = $2;

-- Actualizar cantidad si ya existe carrito
UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *;

-- Agregar nuevo item al carrito
INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *;

-- Actualizacion del carrito por item usuario por id, productos por id y cantidades
DELETE FROM cart WHERE user_id = $1 AND product_id = $2;
UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *;

-- Limpiar carrito 
DELETE FROM cart WHERE user_id = $1;

-- Remover carrito porductos y usuarios por id
DELETE FROM cart WHERE user_id = $1;

-- Obtener favoritos por usuarios id
SELECT p.*, f.created_at as favorited_at 
     FROM favorites f
     JOIN products p ON f.product_id = p.id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC;

-- Agregar favoritos por usuarios y productos por id
INSERT INTO favorites (user_id, product_id)
     VALUES ($1, $2)
     RETURNING *;

-- Eliminar favoritos por usuarios y productos por id
DELETE FROM favorites
     WHERE user_id = $1 AND product_id = $2;

-- Contar favoritos 
SELECT COUNT(*) FROM favorites
     WHERE user_id = $1,

-- Crear usuarios
INSERT INTO users (name, email, password, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, name, email, role, created_at;

-- Eliminar usuaris
DELETE FROM users WHERE id = $1;

-- Resetear contraseña usuarios 
UPDATE users 
        SET password = $1, 
            reset_password_token = NULL, 
            reset_password_expires = NULL 
        WHERE id = $2 
        RETURNING id, name, email, role;

-- Crear orden 
INSERT INTO orders (
      user_id, 
      total, 
      payment_method, 
      shipping_address,
      notes
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, total, status, payment_method, shipping_address, notes, created_at as "createdAt";

-- Actualizar estatus de la orden
UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *`;

-- Crear productos
INSERT INTO products (name, description, price, category, image_url, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

-- Actualizar Productos
UPDATE products SET name = $1, description = $2, price = $3, category = $4, image_url = $5, stock = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *;

-- Eliminar Productos
DELETE FROM products WHERE id = $1;

-- Crear reseña
INSERT INTO reviews (user_id, product_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING *;



