/** Identity, contact, and the non-project content of the site. */

export const site = {
  name: 'Ahmet Keles',
  handle: 'ahmet-keles',
  title: 'Software Engineer',
  location: 'Dallas, Texas',
  school: 'The University of Texas at Dallas',
  graduation: 'Fall 2027',
  seeking: 'Summer 2027 software engineering internships',
  url: 'https://ahmet-keles.github.io',
  email: 'akeles655@gmail.com',
  github: 'https://github.com/ahmet-keles',
  linkedin: 'https://www.linkedin.com/in/ahmet-keles-91b33b228/',
  focus: ['Backend Engineering', 'Distributed Systems', 'Reliability', 'Applied AI & Search'],
  hero: {
    lead: 'I build backend systems that keep their promises when things go wrong.',
    body: 'Computer Science at UT Dallas, graduating Fall 2027. My work is event-driven services, concurrency control, and the failure modes that only appear when a system runs across replicas — plus retrieval and search on the applied-AI side.',
  },
} as const;

export const about = {
  paragraphs: [
    "I'm a Computer Science student at The University of Texas at Dallas, graduating Fall 2027 and pursuing Summer 2027 software engineering internships. My primary interests are backend engineering and distributed systems, with a secondary interest in applied AI and retrieval systems.",
    'What I actually enjoy is the part of a system that only shows up under stress: what happens when a message arrives twice, when a worker dies holding a lock, when two replicas process the same record at the same instant. Most of my projects are built around making those cases explicit and testable rather than hoping they stay rare.',
    'I try to be precise about what my projects do and do not do. Every case study on this site states its current limitations, because a system you can describe honestly is one you actually understand.',
  ],
  principles: [
    {
      title: 'Correctness under concurrency',
      body: 'Optimistic locking, fencing tokens, and row-level claiming instead of assuming operations never overlap.',
    },
    {
      title: 'Failure as a first-class case',
      body: 'Retries, dead-letter paths, compensation, and lease expiry designed in — not bolted on after an incident.',
    },
    {
      title: 'Tests that prove the hard part',
      body: 'Real PostgreSQL and Kafka via Testcontainers, with concurrency tests that drive genuine parallel transactions.',
    },
  ],
} as const;

export const experience = [
  {
    when: 'Summer 2026',
    role: 'Superintendent Intern',
    org: 'Keles Group Inc.',
    body: 'Supported superintendent teams on construction projects totaling over $10.2M across Wylie and Grand Prairie.',
  },
  {
    when: 'Summer 2024',
    role: 'Customer Experience Intern',
    org: 'DTF Order',
    body: 'Supported customer-facing operations for a printing business in Richardson, TX.',
  },
] as const;

export const education = {
  when: 'Expected Fall 2027',
  degree: 'B.S. Computer Science',
  school: 'The University of Texas at Dallas',
} as const;

export const certifications = [
  {
    when: 'August 2026',
    name: 'Claude 101',
    issuer: 'Anthropic',
    href: 'https://verify.skilljar.com/c/u3faoxe7nqz8',
  },
] as const;

/** Grouped for the About page; the home page shows a selected subset. */
export const skillGroups = [
  { group: 'Languages', items: ['Java', 'Python', 'TypeScript', 'C++', 'SQL', 'JavaScript', 'C#'] },
  { group: 'Backend', items: ['Spring Boot', 'FastAPI', 'REST APIs', 'gRPC', 'JPA / Hibernate'] },
  { group: 'Data & Messaging', items: ['PostgreSQL', 'Kafka', 'Redis', 'RabbitMQ', 'pgvector', 'Flyway'] },
  { group: 'Frontend', items: ['React', 'React Router', 'Vite', 'CSS'] },
  { group: 'Infrastructure', items: ['Docker', 'Testcontainers', 'GitHub Actions', 'Git', 'Linux', 'AWS', 'Azure'] },
] as const;

/** The technologies worth surfacing on the home page, in priority order. */
export const selectedTech = [
  'Java',
  'Spring Boot',
  'Kafka',
  'PostgreSQL',
  'Python',
  'FastAPI',
  'Redis',
  'pgvector',
  'Docker',
  'Testcontainers',
  'TypeScript',
  'React',
] as const;
