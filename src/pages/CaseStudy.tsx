import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { getProject } from '../data/projects';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';
import { TechTagList } from '../components/TechTag';
import { Expandable } from '../components/Expandable';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import './CaseStudy.css';

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const project = getProject(slug);

  useDocumentMeta(
    project ? `${project.name} — Ahmet Keles` : 'Not found — Ahmet Keles',
    project?.summary ?? 'Project not found.',
  );

  if (!project) return <Navigate to="/404" replace />;

  const badgeClass = project.status === 'shipped' ? 'badge-shipped' : 'badge-wip';
  const openSections = project.sections.filter((s) => !s.collapsible);
  const detailSections = project.sections.filter((s) => s.collapsible);

  return (
    <article className="shell case">
      <Link className="case-back" to="/projects">
        <ArrowLeft size={15} aria-hidden /> All projects
      </Link>

      <header className="case-head">
        <div className="case-head-row">
          <h1 className="case-title">{project.name}</h1>
          <span className={`badge ${badgeClass}`}>{project.statusLabel}</span>
        </div>
        <p className="case-tagline">{project.tagline}</p>

        <div className="case-actions">
          <a className="btn btn-primary" href={project.repo}>
            <Github size={16} aria-hidden /> Repository
          </a>
          {project.release && (
            <a className="btn btn-ghost" href={project.release.href}>
              <ExternalLink size={15} aria-hidden /> {project.release.label}
            </a>
          )}
        </div>
      </header>

      <section className="case-section" aria-labelledby="what-heading">
        <h2 id="what-heading" className="case-h2">
          What it is
        </h2>
        <p className="case-summary">{project.summary}</p>
      </section>

      <section className="case-section" aria-labelledby="why-heading">
        <h2 id="why-heading" className="case-h2">
          Why it exists
        </h2>
        <div className="prose">
          {project.problem.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="case-section" aria-labelledby="arch-heading">
        <h2 id="arch-heading" className="case-h2">
          Architecture
        </h2>
        <ArchitectureDiagram diagram={project.diagram} />
      </section>

      {openSections.map((section) => (
        <section className="case-section" key={section.id} aria-labelledby={`${section.id}-heading`}>
          <h2 id={`${section.id}-heading`} className="case-h2">
            {section.heading}
          </h2>
          <div className="prose">
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      {detailSections.length > 0 && (
        <section className="case-section" aria-labelledby="detail-heading">
          <h2 id="detail-heading" className="case-h2">
            Implementation detail
          </h2>
          <div className="case-disclosures">
            {detailSections.map((section) => (
              <Expandable key={section.id} summary={section.heading}>
                <div className="prose">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </Expandable>
            ))}
          </div>
        </section>
      )}

      <section className="case-section" aria-labelledby="tradeoffs-heading">
        <h2 id="tradeoffs-heading" className="case-h2">
          Key tradeoffs
        </h2>
        <ul className="tradeoffs">
          {project.tradeoffs.map((tradeoff) => (
            <li className="tradeoff" key={tradeoff.choice}>
              <p className="tradeoff-choice">{tradeoff.choice}</p>
              <div className="tradeoff-cols">
                <div>
                  <span className="tradeoff-label">Gained</span>
                  <p>{tradeoff.gained}</p>
                </div>
                <div>
                  <span className="tradeoff-label tradeoff-label-cost">Cost</span>
                  <p>{tradeoff.cost}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="case-section" aria-labelledby="testing-heading">
        <h2 id="testing-heading" className="case-h2">
          Testing
        </h2>
        <ul className="case-list">
          {project.testing.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="case-section" aria-labelledby="stack-heading">
        <h2 id="stack-heading" className="case-h2">
          Stack
        </h2>
        <TechTagList items={project.stack} />
      </section>

      <aside className="case-limits" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="case-limits-title">
          Current limitations
        </h2>
        <ul className="case-list">
          {project.limitations.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      </aside>

      <nav className="case-foot" aria-label="Project navigation">
        <Link className="case-back" to="/projects">
          <ArrowLeft size={15} aria-hidden /> All projects
        </Link>
        <a className="case-foot-repo" href={project.repo}>
          <Github size={15} aria-hidden /> View source on GitHub
        </a>
      </nav>
    </article>
  );
}
