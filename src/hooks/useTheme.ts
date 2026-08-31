import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function currentTheme(): Theme {
  const explicit = document.documentElement.getAttribute('data-theme');
  return explicit === 'light' || explicit === 'dark' ? explicit : systemTheme();
}

/**
 * Reads the theme the inline bootstrap script in index.html already applied,
 * and flips it on demand. The bootstrap runs before first paint, so the page
 * never flashes the wrong palette on load.
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing: the theme still applies for this page view.
    }
  }, []);

  return { theme, toggle };
}
