// Progressive enhancement for the site: a theme toggle and nav highlighting.
// Loaded as a module, so it is deferred by default and nothing here leaks
// into the global scope. Every feature it adds is optional — the pages are
// fully readable and navigable with this file blocked.

const root = document.documentElement;
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

/* ---------------------------------------------------------------- theme --
   The stylesheet reads `color-scheme` off [data-theme]; the inline script in
   each <head> sets it before first paint. Here we only handle the switching.
   localStorage is absent in some privacy modes, so every access is guarded:
   the toggle still works for the current page view, it just won't persist. */

const stored = {
  read() {
    try {
      const value = localStorage.getItem("theme");
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  },
  write(value) {
    try {
      localStorage.setItem("theme", value);
    } catch {
      /* private browsing — the choice applies to this page view only */
    }
  },
};

const toggle = document.querySelector("#theme-toggle");

function applyTheme(theme) {
  root.dataset.theme = theme;
  toggle?.setAttribute("aria-pressed", String(theme === "dark"));
  // The label names the action, not the state, so screen reader users hear
  // what pressing it will do.
  toggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
  );
}

// Cross-fade the repaint where the browser supports it and the visitor has
// not asked for less motion. Falls straight through otherwise.
function transition(update) {
  if (reducedMotion.matches || !document.startViewTransition) return update();
  return document.startViewTransition(update);
}

if (toggle) {
  applyTheme(root.dataset.theme === "dark" ? "dark" : "light");

  toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    stored.write(next);
    transition(() => applyTheme(next));
  });
}

// Keep following the operating system until the visitor pins a choice.
systemDark.addEventListener("change", (event) => {
  if (stored.read()) return;
  applyTheme(event.matches ? "dark" : "light");
});

/* ------------------------------------------------------------- nav state --
   Mark the nav link whose section is on screen. Only the homepage has
   in-page anchors, so this is a no-op everywhere else. */

const sectionLinks = new Map(
  [...document.querySelectorAll('.nav-links a[href^="#"]')]
    .map((link) => [link.hash.slice(1), link])
    .filter(([id]) => id && document.getElementById(id)),
);

if (sectionLinks.size > 0) {
  const onScreen = new Set();

  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target.id);
        else onScreen.delete(entry.target.id);
      }

      // Two sections share the band while one hands over to the next. Nav
      // order mirrors document order, so taking the last match hands
      // "current" to the section being scrolled into, not the one leaving.
      const active = [...sectionLinks.keys()].findLast((id) => onScreen.has(id));

      for (const [id, link] of sectionLinks) {
        if (id === active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    },
    // A band across the upper middle of the viewport: a section counts as
    // current once its top passes the header, and stops well before it exits.
    { rootMargin: "-20% 0px -70% 0px" },
  );

  for (const id of sectionLinks.keys()) {
    spy.observe(document.getElementById(id));
  }
}
