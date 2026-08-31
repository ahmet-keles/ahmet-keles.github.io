import { Github, Linkedin, Mail } from 'lucide-react';
import { site } from '../data/site';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <p className="footer-note">
          © {new Date().getFullYear()} {site.name} · Built with React, TypeScript &amp; Vite ·{' '}
          <a href="https://github.com/ahmet-keles/ahmet-keles.github.io">Source</a>
        </p>
        <div className="footer-links">
          <a href={site.github} aria-label="GitHub" rel="me">
            <Github size={17} aria-hidden />
          </a>
          <a href={site.linkedin} aria-label="LinkedIn" rel="me">
            <Linkedin size={17} aria-hidden />
          </a>
          <a href={`mailto:${site.email}`} aria-label="Email">
            <Mail size={17} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
