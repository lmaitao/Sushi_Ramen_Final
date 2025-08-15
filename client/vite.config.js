import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config(); // Carga variables de entorno

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    port: 3000, // Puerto para el frontend
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000', // URL de tu backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@context': path.resolve(__dirname, './src/context')
    },
  },
  define: {
    'process.env': process.env, // Pasa variables de entorno al cliente
  },
});