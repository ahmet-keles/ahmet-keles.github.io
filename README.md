# ahmet-keles.github.io

Personal portfolio site for Ahmet Keles — Computer Science @ UT Dallas,
focused on backend and distributed systems. Served by GitHub Pages at
[ahmet-keles.github.io](https://ahmet-keles.github.io/).

## Stack

Static HTML and CSS with one small JavaScript module. No framework, no build
step, no dependencies, no analytics. Files are served exactly as they are
committed.

```
index.html                        homepage
projects/<slug>/index.html        project case studies
writing/index.html                writing index
writing/<slug>/index.html         one directory per post
feed.xml                          RSS feed (hand-maintained; add an <item> per post)
assets/Ahmet-Keles-Resume.pdf     resume PDF linked from the homepage
kmap-looper/                      K-Map Looper tool (single file, no dependencies) and its preview image
assets/styles.css                 design system: tokens, themes, layout, article pages
assets/site.js                    theme toggle and nav highlighting (ES module)
assets/favicon.svg                favicon
```

### Platform features it relies on

The CSS is written against the current platform rather than against a
preprocessor, so a few things work differently from an older stylesheet:

| Feature | What it does here |
| --- | --- |
| `@layer` | `reset, base, layout, components, article, utilities` — cascade order is declared once, so no rule needs `!important` |
| `light-dark()` | One palette instead of three duplicated blocks. Themes switch by setting `color-scheme`, which `[data-theme]` on `<html>` controls |
| Nesting | Each component's rules, including its own media and container queries, live in one block |
| Container queries | Cards reflow on the width of `.section` / `.page`, not the viewport. Viewport media queries are left for genuinely viewport-level things like the header |
| `:has()` | `.project-tool` goes two-column only when it actually has a screenshot |
| `@view-transition` | Cross-document transitions between pages, and a cross-fade on the theme toggle |
| `@property` | `kmap-looper` registers `--l1`–`--l6` as `<color>`. Without registration, `getComputedStyle().getPropertyValue()` hands back the literal `light-dark(...)` text, which canvas cannot parse |

All of it degrades: without JavaScript the pages render and navigate
normally and the theme follows the operating system (the toggle hides
itself rather than sitting there dead), and without view transitions
navigation simply happens with no animation. `prefers-reduced-motion` turns
off smooth scrolling, transitions, and view transitions.

## Adding a post

1. Copy an existing `writing/<slug>/index.html` to a new slug and edit it.
2. Add it to the list in `writing/index.html` and the Writing section of
   `index.html`.
3. Add an `<item>` to `feed.xml` and bump `lastBuildDate`.

## Updating the resume

Overwrite `assets/Ahmet-Keles-Resume.pdf`; the Resume buttons in the hero and
Contact sections link to that path.

## Local preview

Any static file server works. From the repository root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly in a browser also works — all paths are
relative.

## Deployment

GitHub Pages serves the repository root of the `main` branch (this is the
default for a `<username>.github.io` repository — no build workflow and no
configuration are needed). Merging to `main` deploys. Because there is no
build step, what is committed is exactly what is served.

If Pages settings were ever changed: Settings → Pages → Source should be
"Deploy from a branch", branch `main`, folder `/ (root)`.
