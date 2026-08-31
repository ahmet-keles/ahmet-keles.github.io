import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta('Page not found — Ahmet Keles', 'That page does not exist.');

  return (
    <div className="shell page" style={{ maxWidth: '640px', paddingBottom: '48px' }}>
      <p className="eyebrow">404</p>
      <h1 className="page-title">Page not found</h1>
      <p className="page-lede">
        That page doesn&rsquo;t exist — it may have been moved or renamed.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link className="btn btn-primary" to="/">
          Go home
        </Link>
        <Link className="btn btn-ghost" to="/projects">
          View projects
        </Link>
      </div>
    </div>
  );
}
