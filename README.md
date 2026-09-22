# ahmet-keles.github.io

Personal portfolio site for Ahmet Keles — Computer Science @ UT Dallas,
focused on backend and distributed systems. Served by GitHub Pages at
[ahmet-keles.github.io](https://ahmet-keles.github.io/).

## Stack

Plain static HTML, CSS, and a small amount of vanilla JavaScript (the
light/dark theme toggle). No frameworks, no build step, no analytics.

```
index.html                        homepage
projects/<slug>/index.html        project case studies
writing/index.html                writing index
now/index.html                    /now page: what I am doing this semester (edit by hand)
uses/index.html                   /uses page: the stack, with versions
404.html                          not-found page (GitHub Pages serves it automatically)
sitemap.xml, robots.txt           crawler hints; add new pages to the sitemap
assets/og.png                     link-preview image (1200x630) referenced by every page
writing/<slug>/index.html         one directory per post
feed.xml                          RSS feed (hand-maintained; add an <item> per post)
assets/Ahmet-Keles-Resume.pdf     resume PDF linked from the homepage
kmap-looper/                      K-Map Looper tool (single file, no dependencies) and its preview image
logic/                            Logic Diagram Tool (single file, no dependencies) and its preview image
assets/styles.css                 design system: tokens, light/dark themes, layout, article pages
assets/site.js                    theme toggle (persists to localStorage)
assets/favicon.svg                favicon
```

## Adding a post

1. Copy an existing `writing/<slug>/index.html` to a new slug and edit it.
2. Add it to the list in `writing/index.html` and the Writing section of
   `index.html`.
3. Add an `<item>` to `feed.xml` and bump `lastBuildDate`.
4. Add the URL to `sitemap.xml`.

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
configuration are needed). Merging to `main` deploys.

If Pages settings were ever changed: Settings → Pages → Source should be
"Deploy from a branch", branch `main`, folder `/ (root)`.
