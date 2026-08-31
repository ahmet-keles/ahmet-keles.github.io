# ahmet-keles.github.io

Personal engineering portfolio for Ahmet Keles — backend, distributed
systems, and applied AI. Live at
[ahmet-keles.github.io](https://ahmet-keles.github.io/).

## Stack

React 18 · TypeScript (strict) · Vite · React Router 6 · Framer Motion ·
Lucide React. Hand-written CSS with custom properties — no UI framework, no
CSS-in-JS, no analytics.

```
src/
├── data/            content as typed data — the single source of truth
│   ├── types.ts       Project, Diagram, CaseStudySection, Tradeoff …
│   ├── site.ts        identity, about, experience, education, skills
│   └── projects.ts    the four case studies
├── components/
│   ├── Nav.tsx              responsive nav + mobile menu + theme toggle
│   ├── Footer.tsx
│   ├── ProjectCard.tsx      featured and compact variants
│   ├── TechTag.tsx          technology chips
│   ├── ArchitectureDiagram.tsx   renders an SVG diagram from typed data
│   ├── Expandable.tsx       accessible disclosure
│   └── PageTransition.tsx   route-level motion
├── pages/           Home · Projects · CaseStudy · About · Contact · NotFound
├── hooks/           useTheme · useDocumentMeta
└── styles/global.css   design tokens, both themes, layout primitives
```

### Content lives in data, not components

Every project fact is in `src/data/projects.ts`. Adding a project is one
object: the home page, the `/projects` index with its filter, and the
`/projects/:slug` case study all read from the same array. Architecture
diagrams are data too — a list of nodes with coordinates and labelled edges
that `ArchitectureDiagram` renders as SVG, so there are no screenshots to
regenerate when a design changes.

The case-study content is written from each repository's own README on its
main branch, including what each project deliberately does **not** do yet.

## Routes

| Route | Page |
|---|---|
| `/` | Hero, featured work, selected technologies |
| `/projects` | All projects, filterable by domain |
| `/projects/:slug` | Case study — problem, architecture, decisions, testing, tradeoffs, limitations |
| `/about` | About, experience, skills, education, certifications |
| `/contact` | Contact details |
| `*` | 404 |

## Local development

```bash
npm install
npm run dev        # http://localhost:5173

npm run lint       # ESLint
npm run typecheck  # tsc --noEmit, strict
npm run build      # typecheck + vite build + SPA fallback
npm run validate   # all three, in that order
```

## Deployment

`.github/workflows/deploy.yml` runs lint, typecheck, and build on every push
and pull request; pushes to `main` additionally publish `dist/` to GitHub
Pages.

> **One-time setting:** the repository's Pages source must be **GitHub
> Actions** (Settings → Pages → Build and deployment → Source), not "Deploy
> from a branch". The published site is build output, which is not committed.

### Routing on GitHub Pages

The site uses `BrowserRouter` for clean URLs. GitHub Pages is a static file
server with no rewrite rules, so a request for `/projects/novasearch` finds
no such file and falls back to `404.html`. `scripts/spa-fallback.js` copies
`index.html` to `404.html` at the end of every build, so that fallback boots
the app on the requested URL and React Router renders the right page.

The tradeoff: Pages returns HTTP 404 with that document. Browsers do not
care — the page renders normally — but crawlers see a 404 status on deep
links. Prerendering one HTML file per route would fix that; it is not done
here because the route set is small and the trade was made deliberately.

## Adding a resume

No resume PDF is committed. To add one, put it at
`public/Ahmet-Keles-Resume.pdf` (files in `public/` are copied to the site
root) and link `/Ahmet-Keles-Resume.pdf` from `src/pages/Contact.tsx`.
