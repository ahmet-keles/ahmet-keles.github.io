import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section section-top notfound">
      <p className="section-eyebrow">404</p>
      <h1 className="page-title">Page not found</h1>
      <p className="page-lede">That page doesn&rsquo;t exist — it may have been moved or renamed.</p>
      <div className="hero-actions">
        <Link className="btn btn-primary" to="/">
          Go home
        </Link>
        <Link className="btn btn-secondary" to="/projects">
          View projects
        </Link>
      </div>
    </section>
  );
}
