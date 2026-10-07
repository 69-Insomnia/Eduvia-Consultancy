/**
 * Marks a public GET response as shareable at the CDN edge.
 *
 * Without this, every page view re-runs the query against Supabase, which is
 * ~161ms away per round trip — a list endpoint costs two round trips (COUNT
 * then SELECT), so a warm request sits at ~326ms and a cold one at ~3.8s.
 * Letting Vercel hold the response collapses repeat views to an edge hit.
 *
 * The public list endpoints are wrapped in `optionalAuth`, which lets a
 * signed-in admin see deactivated and draft rows. A response that varies by
 * caller must therefore never be shared, so any request carrying a token
 * bypasses the cache entirely rather than being cached under the same URL.
 *
 * Mount this *after* `optionalAuth` so `req.admin` is already resolved.
 */
const publicCache = (seconds = 60) => {
  return (req, res, next) => {
    // optionalAuth reads the token from either the Authorization header or the
    // `token` cookie, so both must be treated as caller-specific.
    const tokenBearing = Boolean(
      req.admin || req.headers.authorization || (req.cookies && req.cookies.token)
    );

    if (tokenBearing) {
      res.setHeader('Cache-Control', 'private, no-store');
      return next();
    }

    res.setHeader(
      'Cache-Control',
      `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 5}`
    );
    next();
  };
};

export default publicCache;
