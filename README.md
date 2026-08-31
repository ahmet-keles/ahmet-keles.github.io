# ahmet-keles.github.io

Personal portfolio site for Ahmet Keles — Computer Science @ UT Dallas,
focused on backend and distributed systems. Live at
[ahmet-keles.github.io](https://ahmet-keles.github.io/).

## Stack

React + React Router on Vite, with **every route prerendered to static HTML
at build time**. No analytics, no UI framework, no runtime backend.

```
index.html            HTML template (placeholders filled per route)
src/main.jsx          client entry — hydrates the prerendered markup
src/entry-server.jsx  server entry — renders a route to a string at build time
src/App.jsx           route table
src/data/content.js   all site content (single source of truth)
src/data/routes.js    route manifest: path, title, description
src/components/       Layout, ThemeToggle, ProjectCard, Entry
src/pages/            Home, Projects, ProjectDetail, About, NotFound
src/styles.css        design system: tokens, light/dark themes, layout
scripts/prerender.js  writes one HTML file per route into dist/
```

### Why prerender?

GitHub Pages is a static file server with no rewrite rules, so a client-only
single-page app answers a deep link like `/projects/novasearch` with a 404.
The common workaround is a `404.html` that redirects into the app, which costs
a round trip and shows crawlers a redirect instead of content.

Instead, the build emits a real HTML file per route
(`dist/projects/novasearch/index.html`, …). Every URL is served directly with
its own `<title>`, description, and fully rendered markup in the source, and
React hydrates on top so navigation between pages stays instant and
client-side.

## Adding content

Everything the site displays lives in `src/data/content.js`. Adding a project
means adding one object to the `projects` array — the home page, the
`/projects` index, its detail route, and the prerenderer all pick it up
automatically. Give it a `slug`, and `src/data/routes.js` derives the route
and its metadata.

## Local development

```bash
npm install
npm run dev      # dev server with hot reload at http://localhost:5173
```

To check what actually ships (prerendered HTML, hydration, deep links):

```bash
npm run build
npx serve dist   # or: cd dist && python3 -m http.server 8000
```

Loading a deep link such as `http://localhost:8000/projects/novasearch`
directly should return prerendered HTML, not a 404.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes `dist/` to GitHub Pages.

> **One-time setting:** the repository's Pages source must be **GitHub
> Actions** (Settings → Pages → Build and deployment → Source), not "Deploy
> from a branch". The published site is the build output, which is not
> committed to the repository.

## Adding a resume

No resume PDF is committed yet, so no Resume button is rendered. To add one:

1. Put the PDF at `public/Ahmet-Keles-Resume.pdf` (files in `public/` are
   copied to the site root as-is).
2. Add a link to it in the contact actions of `src/pages/Home.jsx` and
   `src/pages/About.jsx`:
   `<a className="btn btn-secondary" href="/Ahmet-Keles-Resume.pdf">Resume</a>`
