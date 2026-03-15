import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: ['.replit.dev', '.repl.co'],
    hmr: {
      clientPort: 443,
    },
    proxy: {
      '/auth': 'http://localhost:8000',
      '/deals': 'http://localhost:8000',
      '/itinerary': 'http://localhost:8000',
      '/alerts': 'http://localhost:8000',
      '/calendar': 'http://localhost:8000',
      '/wallet': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    },
  },
})
