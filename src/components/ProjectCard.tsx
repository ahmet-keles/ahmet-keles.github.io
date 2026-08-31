import { Link } from 'react-router-dom';
import { ArrowRight, Github } from 'lucide-react';
import type { Project } from '../data/types';
import './ProjectCard.css';

interface Props {
  readonly project: Project;
  /** Featured cards show the capability list; compact ones do not. */
  readonly variant?: 'featured' | 'compact';
}

export function ProjectCard({ project, variant = 'compact' }: Props) {
  const badgeClass = project.status === 'shipped' ? 'badge-shipped' : 'badge-wip';

  return (
    <article className={`card card-${variant}`}>
      <div className="card-head">
        <h3 className="card-title">
          <Link to={`/projects/${project.slug}`}>{project.name}</Link>
        </h3>
        <span className={`badge ${badgeClass}`}>{project.statusLabel}</span>
      </div>

      <p className="card-tagline">{project.tagline}</p>
      <p className="card-summary">{project.summary}</p>

      {variant === 'featured' && (
        <ul className="card-capabilities">
          {project.capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      )}

      <ul className="card-stack">
        {project.stack.slice(0, 5).map((tech) => (
          <li key={tech.name}>{tech.name}</li>
        ))}
      </ul>

      <div className="card-actions">
        <Link className="card-cta" to={`/projects/${project.slug}`}>
          Case study <ArrowRight size={15} aria-hidden />
        </Link>
        <a className="card-repo" href={project.repo} aria-label={`${project.name} on GitHub`}>
          <Github size={15} aria-hidden /> Repository
        </a>
      </div>
    </article>
  );
}
