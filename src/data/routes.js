/**
 * Route manifest shared by the client and the prerenderer.
 *
 * The build script walks this list to emit one real HTML file per route, so
 * deep links are served directly by GitHub Pages (no redirect shim) and each
 * page ships its own title and description in the markup for crawlers.
 */
import { projects, site } from './content.js';

export const routes = [
  {
    path: '/',
    title: `${site.name} — Software Engineer`,
    description:
      'Ahmet Keles — Computer Science student at UT Dallas building backend and distributed systems: reliability, concurrency, messaging, search, and scalable infrastructure.',
  },
  {
    path: '/projects',
    title: `Projects — ${site.name}`,
    description:
      'Backend and distributed systems projects: event-driven microservices, hybrid search, a distributed job scheduler, and replicated object storage.',
  },
  {
    path: '/about',
    title: `About — ${site.name}`,
    description:
      'About Ahmet Keles: Computer Science at UT Dallas, graduating Fall 2027, seeking Summer 2027 software engineering internships. Experience, skills, education, and certifications.',
  },
  ...projects.map((project) => ({
    path: `/projects/${project.slug}`,
    title: `${project.title} — ${site.name}`,
    description: project.summary,
  })),
  {
    path: '/404',
    title: `Page not found — ${site.name}`,
    description: 'That page does not exist.',
  },
];

export const routeMeta = (pathname) => {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return routes.find((r) => r.path === clean) ?? routes.find((r) => r.path === '/404');
};
