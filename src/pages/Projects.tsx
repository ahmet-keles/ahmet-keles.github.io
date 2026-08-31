import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { allDomains, projects } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import './Projects.css';

const ALL = 'All';

export default function Projects() {
  useDocumentMeta(
    'Projects — Ahmet Keles',
    'Engineering case studies: an event-driven commerce saga, a hybrid search service, a distributed job scheduler, and replicated object storage.',
  );

  const [filter, setFilter] = useState<string>(ALL);
  const reduced = useReducedMotion();

  const filters = useMemo(() => [ALL, ...allDomains], []);
  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.domains.includes(filter as never))),
    [filter],
  );

  return (
    <div className="shell page">
      <p className="eyebrow">Work</p>
      <h1 className="page-title">Projects</h1>
      <p className="page-lede">
        Four systems, each written up as a case study rather than a screenshot: what it does, why it
        exists, how it is built, and — where it matters — what it deliberately does not do yet.
      </p>

      <div className="filters" role="group" aria-label="Filter projects by domain">
        {filters.map((option) => (
          <button
            key={option}
            type="button"
            className={`filter${filter === option ? ' is-active' : ''}`}
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="filter-count" role="status">
        {visible.length} {visible.length === 1 ? 'project' : 'projects'}
        {filter !== ALL && ` in ${filter}`}
      </p>

      <div className="projects-list">
        {visible.map((project, index) => (
          <motion.div
            key={project.slug}
            layout={!reduced}
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.25, delay: index * 0.04 },
                })}
          >
            <ProjectCard project={project} variant="featured" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
