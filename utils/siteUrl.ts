/**
 * Canonical origin for the deployment that is actually serving the request.
 *
 * Vercel injects the deployment hostname automatically, so a demo or preview
 * deployment links to itself instead of to the production domain. Set
 * `NEXT_PUBLIC_SITE_URL` (browser) and `SITE_URL` (server) to override this
 * once the real domain is live.
 *
 * Read lazily via `resolveSiteUrl()` rather than at module scope: ESM hoists
 * imports, so a module-level const would be evaluated before `dotenv.config()`
 * runs and would always miss the value from `.env`.
 */
const PRODUCTION_ORIGIN = 'https://eduviaconsultancy.com';

export function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

  // Next.js inlines NEXT_PUBLIC_* into the browser bundle; plain VERCEL_URL is
  // server-only. Both are hostnames without a protocol scheme.
  const deployed = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;

  const origin = explicit || (deployed ? `https://${deployed}` : PRODUCTION_ORIGIN);
  return origin.replace(/\/+$/, '');
}
