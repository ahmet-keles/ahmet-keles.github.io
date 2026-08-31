import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { featuredProjects, projects } from '../data/projects';
import { selectedTech, site } from '../data/site';
import { ProjectCard } from '../components/ProjectCard';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import './Home.css';

export default function Home() {
  useDocumentMeta(
    `${site.name} — Backend & Distributed Systems`,
    'Ahmet Keles — Computer Science at UT Dallas building event-driven backends, distributed systems, and search infrastructure. Seeking Summer 2027 software engineering internships.',
  );

  const reduced = useReducedMotion();
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay, ease: [0.22, 0.61, 0.36, 1] as const },
        };

  const others = projects.filter((p) => !p.featured);

  return (
    <>
      <section className="hero shell">
        <motion.p className="hero-kicker mono" {...rise(0)}>
          {site.school} · Class of {site.graduation}
        </motion.p>

        <motion.h1 className="hero-title" {...rise(0.06)}>
          {site.hero.lead}
        </motion.h1>

        <motion.p className="hero-body" {...rise(0.12)}>
          {site.hero.body}
        </motion.p>

        <motion.ul className="hero-focus" {...rise(0.18)}>
          {site.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </motion.ul>

        <motion.div className="hero-actions" {...rise(0.24)}>
          <Link className="btn btn-primary" to="/projects">
            Read the case studies <ArrowRight size={16} aria-hidden />
          </Link>
          <a className="btn btn-ghost" href={site.github} rel="me">
            <Github size={16} aria-hidden /> GitHub
          </a>
          <a className="btn btn-ghost" href={site.linkedin} rel="me">
            <Linkedin size={16} aria-hidden /> LinkedIn
          </a>
        </motion.div>
      </section>

      <section className="shell home-section" aria-labelledby="featured-heading">
        <div className="home-section-head">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 id="featured-heading" className="section-title">
              Systems built around failure
            </h2>
          </div>
          <Link className="home-section-more" to="/projects">
            All projects <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <div className="home-featured">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="featured" />
          ))}
        </div>

        <div className="home-grid">
          {others.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="shell home-section" aria-labelledby="tech-heading">
        <p className="eyebrow">Working with</p>
        <h2 id="tech-heading" className="section-title">
          Selected technologies
        </h2>
        <ul className="home-tech">
          {selectedTech.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <p className="home-tech-note">
          The full breakdown, plus experience and education, lives on the{' '}
          <Link to="/about">about page</Link>.
        </p>
      </section>
    </>
  );
}
