import { cache } from 'react';
import SiteSettings from '../models/SiteSettings';
import PageSeo from '../models/PageSeo';

/**
 * Site settings and page-SEO overrides, read on the server for the root layout.
 *
 * Imported by `app/layout.tsx` only �?" never by the Express app.
 *
 * Both values are fetched by `SettingsContext` and `PageSeoContext` on mount, on
 * every page, for every visitor: two API round trips that each reach Supabase
 * (~161ms per round trip) before the page can settle. Reading them here lets the
 * values ship with the first byte of HTML instead.
 *
 * Memoised per render request with React `cache()` (deduplicates the layout's
 * read and each `generateMetadata` call within one request) but NOT across
 * requests: an admin's SEO edit must reach the page on the next render. Page
 * HTML freshness is handled by `export const revalidate = 60` on the pages plus
 * `res.revalidate(path)` purges fired from the admin write endpoints, so the
 * worst-case staleness of an edit is one purge round trip.
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

const getBootstrapData = cache(loadBootstrapData);

export default getBootstrapData;
