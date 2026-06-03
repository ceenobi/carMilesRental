import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3400,
    open: true,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3500',
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: [
      'localhost',
      'salmon-daring-partially.ngrok-free.app',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      'car-miles-rental-server.vercel.app',
    ],
  },
})
