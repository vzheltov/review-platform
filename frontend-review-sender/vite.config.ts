import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/send/',
  server: {
    host: true,
    port: 80,
    allowedHosts: true,
    hmr: {
      clientPort: 1414,
    },
  },
});
