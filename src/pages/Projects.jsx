import { projects } from '../data/content.js';
import ProjectCard from '../components/ProjectCard.jsx';

export default function Projects() {
  return (
    <section className="section section-top">
      <p className="section-eyebrow">Work</p>
      <h1 className="page-title">Projects</h1>
      <p className="page-lede">
        Backend and distributed systems, plus one applied-AI retrieval project. Each
        page below describes what the system actually does today — including where a
        project is still incomplete.
      </p>
      <div className="project-list">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} featured />
        ))}
      </div>
    </section>
  );
}
