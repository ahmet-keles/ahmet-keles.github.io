import { Link, useParams } from 'react-router-dom';
import { getProject } from '../data/content.js';
import NotFound from './NotFound.jsx';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) return <NotFound />;

  const { detail } = project;

  return (
    <article className="section section-top detail">
      <p className="section-eyebrow">
        <Link to="/projects">Projects</Link> / {project.slug}
      </p>

      <div className="detail-head">
        <h1 className="page-title">{project.title}</h1>
        <span className={`status status-${project.status === 'complete' ? 'done' : 'wip'}`}>
          {project.statusLabel}
        </span>
      </div>

      <p className="project-stack">{project.stack.join(' · ')}</p>
      <p className="page-lede">{detail.lede}</p>

      <div className="detail-links">
        {project.links.map((l) => (
          <a className="btn btn-secondary" key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>

      <dl className="facts">
        {detail.facts.map(([term, value]) => (
          <div className="fact" key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {detail.sections.map((section) => (
        <section className="detail-section" key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}

      {detail.limitations && (
        <aside className="callout" aria-label="Current limitations">
          <h2>Current limitations</h2>
          <p>{detail.limitations}</p>
        </aside>
      )}

      <p className="detail-back">
        <Link className="link-arrow" to="/projects">
          All projects
        </Link>
      </p>
    </article>
  );
}
