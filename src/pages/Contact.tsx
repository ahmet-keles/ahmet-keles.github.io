import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { site } from '../data/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import './Contact.css';

export default function Contact() {
  useDocumentMeta(
    'Contact — Ahmet Keles',
    'Get in touch with Ahmet Keles — open to Summer 2027 software engineering internships in backend, distributed systems, and applied AI.',
  );

  return (
    <div className="shell page contact">
      <p className="eyebrow">Contact</p>
      <h1 className="page-title">Get in touch</h1>
      <p className="page-lede">
        I&rsquo;m open to {site.seeking} — backend, distributed systems, and applied AI. The fastest
        way to reach me is email; code and history are on GitHub.
      </p>

      <ul className="contact-list">
        <li>
          <a className="contact-item" href={`mailto:${site.email}`}>
            <Mail size={18} aria-hidden />
            <span>
              <span className="contact-label">Email</span>
              <span className="contact-value">{site.email}</span>
            </span>
          </a>
        </li>
        <li>
          <a className="contact-item" href={site.github} rel="me">
            <Github size={18} aria-hidden />
            <span>
              <span className="contact-label">GitHub</span>
              <span className="contact-value">github.com/{site.handle}</span>
            </span>
          </a>
        </li>
        <li>
          <a className="contact-item" href={site.linkedin} rel="me">
            <Linkedin size={18} aria-hidden />
            <span>
              <span className="contact-label">LinkedIn</span>
              <span className="contact-value">Ahmet Keles</span>
            </span>
          </a>
        </li>
        <li>
          <div className="contact-item contact-item-static">
            <MapPin size={18} aria-hidden />
            <span>
              <span className="contact-label">Based in</span>
              <span className="contact-value">{site.location}</span>
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
}
