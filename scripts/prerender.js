/**
 * Renders every route to a real HTML file.
 *
 * GitHub Pages is a static file server with no rewrite rules, so a
 * client-only SPA answers a deep link like /projects/novasearch with a 404.
 * The usual workaround is a 404.html that redirects into the app, which costs
 * a round trip and shows crawlers a redirect instead of content. Emitting one
 * prerendered file per route avoids both: every URL is served directly, with
 * its own title, description, and fully rendered markup in the source, and
 * React hydrates on top for instant client-side navigation afterwards.
 *
 * Runs after the two Vite builds: the client build produces dist/ plus the
 * HTML template, and the SSR build produces dist-ssr/entry-server.js.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, 'dist');

const { render, routes } = await import(
  pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href
);

const template = readFileSync(join(distDir, 'index.html'), 'utf8');
const canonicalBase = 'https://ahmet-keles.github.io';

/** Escapes a string for use inside a double-quoted HTML attribute. */
const attr = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

for (const route of routes) {
  const html = render(route.path);
  const canonical = route.path === '/' ? `${canonicalBase}/` : `${canonicalBase}${route.path}`;

  const page = template
    .replace('<!--app-html-->', html)
    .replaceAll('<!--app-title-->', attr(route.title))
    .replaceAll('<!--app-description-->', attr(route.description))
    .replaceAll('<!--app-canonical-->', attr(canonical));

  // '/' -> dist/index.html; '/404' -> dist/404.html (GitHub Pages' own
  // not-found document); anything else -> dist/<path>/index.html so the
  // clean URL resolves without a trailing-slash redirect.
  const outFile =
    route.path === '/'
      ? join(distDir, 'index.html')
      : route.path === '/404'
        ? join(distDir, '404.html')
        : join(distDir, route.path, 'index.html');

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, page);
  console.log(`prerendered ${route.path.padEnd(36)} -> ${outFile.replace(root + '/', '')}`);
}

console.log(`\n${routes.length} routes prerendered.`);
