import { about, certifications, education, experience, site, skillGroups } from '../data/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import './About.css';

export default function About() {
  useDocumentMeta(
    'About — Ahmet Keles',
    'Computer Science at UT Dallas, graduating Fall 2027. Backend and distributed systems focus, with experience, skills, education, and certifications.',
  );

  return (
    <div className="shell page about">
      <p className="eyebrow">About</p>
      <h1 className="page-title">{site.name}</h1>

      <div className="prose about-lead">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <section className="about-block" aria-labelledby="principles-heading">
        <h2 id="principles-heading" className="about-h2">
          How I approach systems
        </h2>
        <ul className="principles">
          {about.principles.map((principle) => (
            <li className="principle" key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-block" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="about-h2">
          Experience
        </h2>
        {experience.map((job) => (
          <div className="row" key={job.org}>
            <div className="row-when mono">{job.when}</div>
            <div className="row-body">
              <h3>
                {job.role} · {job.org}
              </h3>
              <p>{job.body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="about-block" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="about-h2">
          Skills
        </h2>
        <div className="skill-groups">
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.group}>
              <h3>{group.group}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="about-block" aria-labelledby="education-heading">
        <h2 id="education-heading" className="about-h2">
          Education
        </h2>
        <div className="row">
          <div className="row-when mono">{education.when}</div>
          <div className="row-body">
            <h3>
              {education.degree} · {education.school}
            </h3>
          </div>
        </div>
      </section>

      <section className="about-block" aria-labelledby="certs-heading">
        <h2 id="certs-heading" className="about-h2">
          Certifications
        </h2>
        {certifications.map((cert) => (
          <div className="row" key={cert.name}>
            <div className="row-when mono">{cert.when}</div>
            <div className="row-body">
              <h3>
                {cert.name} · {cert.issuer}
              </h3>
              <p>
                <a href={cert.href}>Verify credential</a>
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
