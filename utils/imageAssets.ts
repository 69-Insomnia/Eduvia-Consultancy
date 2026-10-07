export const DESTINATION_IMAGES = {
  australia: '/destinations/australia.jpg',
  canada: '/destinations/canada.jpg',
  'united-kingdom': '/destinations/united-kingdom.jpg',
  'united-states': '/destinations/united-states.jpg',
  'new-zealand': '/destinations/new-zealand.jpg',
  germany: '/destinations/germany.jpg',
  japan: '/destinations/japan.jpg',
  ireland: '/destinations/ireland.jpg',
  'south-korea': '/destinations/south-korea.jpg',
  finland: '/destinations/finland.jpg',
  netherlands: '/destinations/netherlands.jpg',
  dubai: '/destinations/dubai.jpg',
  // Same hero as `dubai`, kept under both keys: the destination record and the
  // constants entry were renamed to "United Arab Emirates", but a legacy link or
  // a record still carrying the old `dubai-uae` slug must not lose its image.
  'united-arab-emirates': '/destinations/dubai.jpg',
};

/**
 * Country flags for the destination cards.
 *
 * Sourced from flagcdn.com (public-domain renders of the Wikimedia Commons
 * vector flags, free for commercial use) and vendored into `public/flags/`
 * so page loads make no third-party request. Downloaded at 320px wide.
 */
export const DESTINATION_FLAGS = {
  australia: '/flags/au.png',
  canada: '/flags/ca.png',
  'united-kingdom': '/flags/gb.png',
  'united-states': '/flags/us.png',
  'new-zealand': '/flags/nz.png',
  germany: '/flags/de.png',
  japan: '/flags/jp.png',
  ireland: '/flags/ie.png',
  'south-korea': '/flags/kr.png',
  finland: '/flags/fi.png',
  netherlands: '/flags/nl.png',
  dubai: '/flags/ae.png',
  // See the note on DESTINATION_IMAGES: both keys resolve to the UAE flag.
  'united-arab-emirates': '/flags/ae.png',
};

/**
 * Campus imagery for the university cards, keyed by the auto-generated slug.
 *
 * These are GENERIC campus photographs from Unsplash (free for commercial use,
 * no attribution required, self-hosting permitted). They are deliberately NOT
 * photographs of the named institutions — do not present them as such. Replace
 * them with licensed photography of the real campuses, or upload real images
 * through the admin, before launch.
 */
export const UNIVERSITY_IMAGES = {
  'university-of-melbourne': '/universities/university-of-melbourne.jpg',
  'university-of-toronto': '/universities/university-of-toronto.jpg',
  'university-of-sydney': '/universities/university-of-sydney.jpg',
  'university-of-british-columbia': '/universities/university-of-british-columbia.jpg',
  'university-of-manchester': '/universities/university-of-manchester.jpg',
  'monash-university': '/universities/monash-university.jpg',
  'university-of-waterloo': '/universities/university-of-waterloo.jpg',
  'university-of-auckland': '/universities/university-of-auckland.jpg',
  'national-university-of-singapore': '/universities/national-university-of-singapore.jpg',
  'rwth-aachen-university': '/universities/rwth-aachen-university.jpg',

  /*
   * Unlike the Unsplash set above, this one is a REAL photograph of the named
   * campus, so it carries an attribution requirement.
   *
   *   "The University of Arizona - buildings" by Baah Thomas
   *   Wikimedia Commons — CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
   *   https://commons.wikimedia.org/wiki/File:The_University_of_Arizona_-_buildings.jpg
   *
   * CC BY 4.0 permits commercial use and self-hosting but requires credit, so
   * the photographer must be acknowledged wherever this image is shown (an
   * image credits page is the usual home). Swapping in a UA-owned photo the
   * client has permission to use would drop that obligation.
   */
  'university-of-arizona': '/universities/university-of-arizona.jpg',
};

/**
 * Ordered image candidates for a destination, most-trusted first.
 *
 * A stored path is not reliable on its own. Records written before the current
 * asset layout settled carried a dead `/images/` prefix — the database rows were
 * rewritten by `npm run fix:images`, but an uncorrected CMS value can still
 * arrive here — and one record was slugged `dubai-uae` while the asset map
 * keyed on `dubai`; that record is now `united-arab-emirates`, which both the
 * map and the alias below cover. The component walks this list and stops at the
 * first image that actually loads, so a CMS upload still wins when present but
 * a stale record degrades to the bundled photo instead of a blank card.
 */
export function destinationImageCandidates(storedPath, slug) {
  const out = [];
  const key = String(slug || '');
  // Tolerates legacy suffixed slugs, e.g. 'dubai-uae' -> 'dubai'
  const bare = key.replace(/-(uae|uk|usa)$/i, '');

  if (storedPath) {
    // A legacy `/images/` prefix is known-dead here, so try the corrected
    // form first and keep the original only as a last resort.
    if (storedPath.startsWith('/images/')) {
      out.push(storedPath.replace(/^\/images/, ''));
    }
    out.push(storedPath);
  }
  if (DESTINATION_IMAGES[key]) out.push(DESTINATION_IMAGES[key]);
  if (bare !== key && DESTINATION_IMAGES[bare]) out.push(DESTINATION_IMAGES[bare]);

  return [...new Set(out)].filter(Boolean);
}

/** Flag lookup that tolerates slugs like `dubai-uae`. */
export function destinationFlag(slug) {
  const key = String(slug || '');
  return DESTINATION_FLAGS[key] || DESTINATION_FLAGS[key.replace(/-(uae|uk|usa)$/i, '')] || null;
}

/**
 * Hero imagery for the blog cards, keyed by slug.
 *
 * Same caveat as UNIVERSITY_IMAGES: these are GENERIC photographs from Unsplash
 * (free for commercial use), not depictions of the places or people named in the
 * articles. Replace with owned art before launch.
 */
export const BLOG_IMAGES = {
  'complete-guide-to-studying-in-australia-in-2026': '/blogs/study-in-australia.jpg',
  'canada-vs-australia-which-is-better-for-nepali-students': '/blogs/canada-vs-australia.jpg',
  'how-to-write-a-winning-statement-of-purpose-sop': '/blogs/sop-writing.jpg',
};

/**
 * Ordered image candidates for a blog post, most-trusted first.
 *
 * Seeded posts used to carry a dead `/images/blogs/...` prefix, so the stored
 * path 404s while still being truthy and the old `featuredImage || fallback`
 * test never fired (the string was truthy, so the fallback was unreachable).
 * Those rows were rewritten by `npm run fix:images`; the prefix strip below
 * still covers an uncorrected value, the slug map covers posts whose filename
 * drifted, and the stock photo keeps a CMS-less record from rendering a blank
 * card.
 */
export function blogImageCandidates(storedPath, slug) {
  const out = [];
  if (storedPath) {
    if (storedPath.startsWith('/images/')) out.push(storedPath.replace(/^\/images/, ''));
    out.push(storedPath);
  }
  const mapped = BLOG_IMAGES[String(slug || '')];
  if (mapped) out.push(mapped);
  out.push(SITE_IMAGES.blogFallback);
  return [...new Set(out)].filter(Boolean);
}

/**
 * Ordered candidates for a CMS-managed image we hold no bundled copy of —
 * team headshots, university crests, and the like.
 *
 * The seed used to point these at `/images/...` and no such files were ever
 * uploaded, so the stored path 404s while still being truthy — which is why the
 * old `photo ? <img/> : <placeholder/>` tests rendered a broken-image icon
 * instead of the placeholder. `npm run fix:images` cleared those rows, but the
 * prefix strip below still tolerates an uncorrected one. There is deliberately
 * no stock replacement: passing a stranger's face off as a named counselor, or a
 * generic crest off as an institution's mark, misrepresents the record. Callers
 * supply their own placeholder once these run out.
 */
export function storedImageCandidates(storedPath) {
  const out = [];
  if (storedPath) {
    if (storedPath.startsWith('/images/')) out.push(storedPath.replace(/^\/images/, ''));
    out.push(storedPath);
  }
  return [...new Set(out)].filter(Boolean);
}

export const SITE_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=85',
  counseling: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85',
  blogFallback: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
  universityFallback: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=700&q=80',
};
