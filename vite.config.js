import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from the domain root (a <user>.github.io repository), so base is '/'.
export default defineConfig({
  plugins: [react()],
  build: { emptyOutDir: true },
});
