import { Link } from 'react-router-dom';

/** Project summary card. `featured` gives the flagship a wider treatment. */
export default function ProjectCard({ project, featured = false }) {
  return (
    <article className={`project${featured ? ' project-featured' : ''}`}>
      <div className="project-head">
        <h3>
          <Link to={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <span className={`status status-${project.status === 'complete' ? 'done' : 'wip'}`}>
          {project.statusLabel}
        </span>
      </div>
      <p className="project-stack">{project.stack.join(' · ')}</p>
      <p className="project-desc">{project.summary}</p>
      {featured && (
        <ul className="project-highlights">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
      <div className="project-links">
        <Link className="link-arrow" to={`/projects/${project.slug}`}>
          Read more
        </Link>
        {project.links.map((l) => (
          <a className="link-arrow" key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
    </article>
  );
}
