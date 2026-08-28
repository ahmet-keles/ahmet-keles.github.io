# ahmet-keles.github.io

Personal portfolio site for Ahmet Keles — Computer Science @ UT Dallas,
focused on backend and distributed systems. Served by GitHub Pages at
[ahmet-keles.github.io](https://ahmet-keles.github.io/).

## Stack

Plain static HTML, CSS, and a small amount of vanilla JavaScript (the
light/dark theme toggle). No frameworks, no build step, no analytics.

```
index.html          the whole site (single page)
assets/styles.css   design system: tokens, light/dark themes, layout
assets/site.js      theme toggle (persists to localStorage)
assets/favicon.svg  favicon
```

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
configuration are needed). Merging to `main` deploys.

If Pages settings were ever changed: Settings → Pages → Source should be
"Deploy from a branch", branch `main`, folder `/ (root)`.

## Adding a resume

The Contact section has a disabled "Resume" button because no PDF is
committed yet. To enable it:

1. Add your PDF at `assets/Ahmet-Keles-Resume.pdf`.
2. In `index.html`, find the `RESUME:` comment in the Contact section and
   replace the disabled `<span>` with the anchor tag shown in that comment.
