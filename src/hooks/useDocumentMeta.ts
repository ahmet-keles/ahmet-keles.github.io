import { useEffect } from 'react';

/**
 * Sets the document title and meta description for a route.
 *
 * The app is served as an SPA, so per-page metadata is applied on the client
 * as routes change. Crawlers that execute JavaScript read the updated tags.
 */
export function useDocumentMeta(title: string, description: string): void {
  useEffect(() => {
    document.title = title;

    const tag = document.querySelector('meta[name="description"]');
    if (tag) tag.setAttribute('content', description);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', window.location.href);
  }, [title, description]);
}
