import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This repository is the GitHub Pages *user* site (ahmet-keles.github.io),
// which is served from the domain root — so base stays '/'. A project site
// would need '/<repo>/' here instead.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
