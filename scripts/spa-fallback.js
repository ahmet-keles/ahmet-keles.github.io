/**
 * Copies dist/index.html to dist/404.html.
 *
 * GitHub Pages is a static file server with no rewrite rules, so a request
 * for /projects/novasearch finds no file and falls back to 404.html. Serving
 * the app there means BrowserRouter boots on the requested URL and renders
 * the right route, which is what makes clean (non-hash) deep links work.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(dirname(fileURLToPath(import.meta.url))), 'dist');
const index = join(dist, 'index.html');

if (!existsSync(index)) {
  console.error('spa-fallback: dist/index.html not found — run vite build first.');
  process.exit(1);
}

copyFileSync(index, join(dist, '404.html'));
console.log('spa-fallback: wrote dist/404.html for client-side routing');
