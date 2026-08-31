import { about, certifications, education, experience, site, skills } from '../data/content.js';
import Entry from '../components/Entry.jsx';

export default function About() {
  return (
    <>
      <section className="section section-top">
        <p className="section-eyebrow">About</p>
        <h1 className="page-title">{site.name}</h1>
        <div className="about-copy about-copy-lead">
          {about.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="experience-heading">
        <p className="section-eyebrow">Experience</p>
        <h2 id="experience-heading">Experience</h2>
        {experience.map((job) => (
          <Entry key={job.title} when={job.when} title={job.title}>
            <p>{job.body}</p>
          </Entry>
        ))}
      </section>

      <section className="section" aria-labelledby="skills-heading">
        <p className="section-eyebrow">Skills</p>
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
        <p className="section-eyebrow">Education</p>
        <h2 id="education-heading">Education</h2>
        <Entry when={education.when} title={education.title} />
      </section>

      <section className="section" aria-labelledby="certs-heading">
        <p className="section-eyebrow">Certifications</p>
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
        <p className="section-eyebrow">Contact</p>
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
