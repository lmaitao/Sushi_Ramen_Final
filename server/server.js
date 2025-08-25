import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { config } from 'dotenv';
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares 
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use('/product-images', express.static('path/to/your/images/folder'));

// Rutas 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Manejo de errores 
app.use(notFound);
app.use(errorHandler);

// Inicio del servidor 
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(` 🔥 Servidor corriendo en https://sushi-ramen-final.onrender.com:${PORT}`);
  });
}


export default app;