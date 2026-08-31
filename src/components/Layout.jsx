import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { site } from '../data/content.js';
import { routeMeta } from '../data/routes.js';
import ThemeToggle from './ThemeToggle.jsx';

/**
 * Keeps the document title and description in step with client-side
 * navigation. The prerendered HTML already carries the correct tags for a
 * cold load, so this only matters once the router takes over.
 */
function useDocumentMeta(pathname) {
  useEffect(() => {
    const meta = routeMeta(pathname);
    if (!meta) return;
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', meta.description);
  }, [pathname]);
}

/** Scrolls to top on route change, but leaves in-page hash links alone. */
function useScrollReset(pathname, hash) {
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export default function Layout({ children }) {
  const { pathname, hash } = useLocation();
  useDocumentMeta(pathname);
  useScrollReset(pathname, hash);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <nav className="nav" aria-label="Primary">
          <Link className="nav-name" to="/">
            ahmet-keles
            <span className="nav-cursor" aria-hidden="true">
              _
            </span>
          </Link>
          <div className="nav-links">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/about">About</NavLink>
            <a href={`mailto:${site.email}`}>Contact</a>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="main">{children}</main>

      <footer className="site-footer">
        <p>
          © 2026 {site.name} · Built with React, React Router &amp; Vite ·{' '}
          <a href="https://github.com/ahmet-keles/ahmet-keles.github.io">Source</a>
        </p>
      </footer>
    </>
  );
}
