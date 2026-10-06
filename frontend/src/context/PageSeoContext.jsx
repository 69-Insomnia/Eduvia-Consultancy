import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const PageSeoContext = createContext(null);

/**
 * Per-page SEO overrides for the site's own pages.
 *
 * Entity pages carry their own `seo` subdocument, but static pages (About,
 * Contact, Privacy Policy, …) had their metadata hardcoded in JSX. This fetches
 * the overrides an editor has set in the admin so those pages can apply them.
 *
 * Loaded once for the whole app rather than per page: it is a single small
 * request covering every page, and it happens alongside the settings fetch.
 *
 * On failure the map stays empty and every page falls back to the default
 * compiled into it — the site must render sensible metadata even when the API
 * is unreachable.
 */
export function PageSeoProvider({ children }) {
  const [pages, setPages] = useState({});

  const fetchPageSeo = useCallback(async () => {
    try {
      const res = await api.get('/page-seo');
      const list = res.data?.pages || [];
      setPages(
        Object.fromEntries(
          list.filter((page) => page?.key).map((page) => [page.key, page.seo || {}])
        )
      );
    } catch {
      // keep the empty map; pages use their built-in defaults
    }
  }, []);

  useEffect(() => {
    fetchPageSeo();
  }, [fetchPageSeo]);

  /**
   * Returns the stored override for a page key, or `undefined` when the page
   * has none — so callers can write `pageSeo?.title || 'default'`.
   *
   * A row that exists but has no `title` is treated as no override at all: an
   * empty row means "use the default", not "render an empty title".
   */
  const getPageSeo = useCallback(
    (key) => {
      const seo = pages[key];
      return seo?.title ? seo : undefined;
    },
    [pages]
  );

  return (
    <PageSeoContext.Provider value={{ pages, getPageSeo, refreshPageSeo: fetchPageSeo }}>
      {children}
    </PageSeoContext.Provider>
  );
}

export function usePageSeo() {
  const context = useContext(PageSeoContext);
  if (!context) {
    throw new Error('usePageSeo must be used within a PageSeoProvider');
  }
  return context;
}

/**
 * Merges a page's stored SEO over the defaults compiled into that page.
 *
 * Keeps the default copy next to the page it belongs to rather than moving it
 * server-side, for the same reason `SettingsContext` keeps `DEFAULT_SETTINGS`:
 * the page must still render sensible metadata when the API is unreachable.
 *
 * Returns the exact prop set `<SEO>` accepts, so a page becomes
 * `const seo = useMergedSeo('about', {...defaults}); <SEO {...seo} />`.
 *
 * `defaults` is read on every render but only ever consulted for keys the
 * editor has not overridden.
 */
export function useMergedSeo(key, defaults = {}) {
  const { getPageSeo } = usePageSeo();
  const stored = getPageSeo(key);

  return {
    title: stored?.title || defaults.title,
    description: stored?.description || defaults.description,
    keywords: stored?.keywords?.length ? stored.keywords.join(', ') : defaults.keywords,
    image: stored?.ogImage || defaults.image,
    robots: stored?.robots || defaults.robots,
    canonical: stored?.canonical || defaults.canonical,
  };
}
