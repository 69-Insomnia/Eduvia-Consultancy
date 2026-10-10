/**
 * Purges the cached HTML for the given paths so an admin's change reaches the
 * public site immediately.
 *
 * `res.revalidate(path)` is the Pages Router on-demand ISR API. Every public
 * page declares `export const revalidate = 60` (a safety net for edits that
 * never go through the API), and the write endpoints below call this so a save
 * is visible on the next request rather than after the interval. Failures are
 * swallowed: a purge that cannot run must never fail the save itself �?" the
 * 60-second revalidate window still applies.
 */
export const purgePaths = async (res: any, paths: Array<string | undefined | null>) => {
  for (const path of Array.from(new Set(paths.filter(Boolean)))) {
    try {
      await res.revalidate(path);
    } catch {
      // Path was not prerendered (or revalidation is unavailable in this
      // context); the page's own revalidate interval covers it.
    }
  }
};

export default purgePaths;
