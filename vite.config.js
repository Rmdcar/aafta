import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // ou outro número, se necessário
  },
  build: {
    outDir: 'dist',
  },
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
