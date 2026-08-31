import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { site } from '../data/site';
import './Nav.css';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/contact', label: 'Contact', end: false },
] as const;

export function Nav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Any navigation closes the menu — otherwise it hangs over the new page.
  useEffect(() => setOpen(false), [pathname]);

  // Escape closes and returns focus to the control that opened the menu,
  // so keyboard users are not stranded at the top of the document.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav-root">
      <nav className="nav shell" aria-label="Primary">
        <Link className="nav-brand" to="/">
          <span className="nav-brand-name">{site.handle}</span>
          <span className="nav-brand-caret" aria-hidden="true">
            _
          </span>
        </Link>

        <div className="nav-desktop">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-controls">
          <button
            type="button"
            className="icon-btn"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
          </button>

          <button
            ref={triggerRef}
            type="button"
            className="icon-btn nav-burger"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={`nav-mobile${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className="nav-mobile-link">
            {link.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
