import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'ENDPOINT'],
  server: {
    port: 5173,
    host: true
  }
});

