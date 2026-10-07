import { unstable_cache } from 'next/cache';
import SiteSettings from '../models/SiteSettings';
import PageSeo from '../models/PageSeo';

/**
 * Site settings and page-SEO overrides, read on the server for the root layout.
 *
 * Imported by `app/layout.tsx` only — never by the Express app.
 *
 * Both values are fetched by `SettingsContext` and `PageSeoContext` on mount, on
 * every page, for every visitor: two API round trips that each reach Supabase
 * (~161ms per round trip) before the page can settle. Reading them here lets the
 * values ship with the first byte of HTML instead.
 *
 * Wrapped in `unstable_cache` so the queries run at most once per revalidation
 * window rather than on every request — which also keeps the route out of
 * dynamic rendering. The trade-off is that an editor's change takes up to 5
 * minutes to reach the public site.
 *
 * Deliberately read-only: `SiteSettings.getSettings()` creates a row when none
 * exists, and a write on the render path (including at build time) is not
 * something a page render should be able to trigger. A missing row degrades to
 * the defaults compiled into the contexts.
 */
async function loadBootstrapData() {
  try {
    const [settings, pageSeoRows] = await Promise.all([
      SiteSettings.findOne(),
      PageSeo.findAll({ attributes: ['key', 'seo'] }),
    ]);

    return {
      // `toJSON` is overridden by applyApiShape to emit the same wire format the
      // REST endpoints produce, so the contexts normalize an identical shape.
      settings: settings ? settings.toJSON() : null,
      pages: pageSeoRows.map((row: any) => ({ key: row.key, seo: row.seo || {} })),
    };
  } catch {
    // A database blip must not take down every page: the contexts fall back to
    // their compiled defaults when these come back empty.
    return { settings: null, pages: [] as { key: string; seo: any }[] };
  }
}

const getBootstrapData = unstable_cache(loadBootstrapData, ['eduvia-bootstrap'], {
  revalidate: 300,
});

export default getBootstrapData;
