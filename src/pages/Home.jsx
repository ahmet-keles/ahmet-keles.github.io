import { Link } from 'react-router-dom';
import { about, certifications, education, projects, site, skills } from '../data/content.js';
import ProjectCard from '../components/ProjectCard.jsx';
import Entry from '../components/Entry.jsx';

export default function Home() {
  const [featured, ...rest] = projects;

  return (
    <>
      <section className="hero">
        <p className="hero-kicker">{site.kicker}</p>
        <h1>{site.name}</h1>
        <p className="hero-roles">{site.role}</p>
        <p className="hero-statement">{site.statement}</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/projects">
            View Projects
          </Link>
          <a className="btn btn-secondary" href={site.github} rel="me">
            GitHub
          </a>
          <a className="btn btn-secondary" href={site.linkedin} rel="me">
            LinkedIn
          </a>
        </div>
      </section>

      <section className="section" aria-labelledby="about-heading">
        <p className="section-eyebrow">01 · About</p>
        <h2 id="about-heading">About</h2>
        <div className="about-copy">
          <p>{about[0]}</p>
        </div>
        <p className="section-more">
          <Link className="link-arrow" to="/about">
            More about me
          </Link>
        </p>
      </section>

      <section className="section" aria-labelledby="projects-heading">
        <p className="section-eyebrow">02 · Work</p>
        <h2 id="projects-heading">Featured Projects</h2>
        <ProjectCard project={featured} featured />
        <div className="project-grid">
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="skills-heading">
        <p className="section-eyebrow">03 · Skills</p>
        <h2 id="skills-heading">Skills</h2>
        <div className="skills-grid">
          {skills.map((group) => (
            <div className="skill-group" key={group.group}>
              <h3>{group.group}</h3>
              <ul className="chips">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="education-heading">
        <p className="section-eyebrow">04 · Education</p>
        <h2 id="education-heading">Education</h2>
        <Entry when={education.when} title={education.title} />
      </section>

      <section className="section" aria-labelledby="certs-heading">
        <p className="section-eyebrow">05 · Certifications</p>
        <h2 id="certs-heading">Certifications</h2>
        {certifications.map((cert) => (
          <Entry key={cert.title} when={cert.when} title={cert.title}>
            <p>
              <a className="link-arrow" href={cert.href}>
                {cert.linkLabel}
              </a>
            </p>
          </Entry>
        ))}
      </section>

      <section className="section section-contact" aria-labelledby="contact-heading">
        <p className="section-eyebrow">06 · Contact</p>
        <h2 id="contact-heading">Get in touch</h2>
        <p className="contact-lede">
          Open to Summer 2027 software engineering internships — backend, distributed
          systems, and applied AI.
        </p>
        <div className="contact-actions">
          <a className="btn btn-primary" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a className="btn btn-secondary" href={site.github} rel="me">
            GitHub
          </a>
          <a className="btn btn-secondary" href={site.linkedin} rel="me">
            LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
