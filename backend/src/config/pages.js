/**
 * The canonical registry of the site's own pages.
 *
 * These are the routes in frontend/src/App.jsx that render fixed content rather
 * than a database entity. Each one gets a `PageSeo` row keyed by `key`, so an
 * editor can override its metadata without a code change.
 *
 * This list is the single source of truth: it seeds `PageSeo`, it is what the
 * admin screen lists, and the frontend keys its lookups off the same strings.
 * A typo here is silent — the page just falls back to its built-in default and
 * looks like the admin is broken — so import these keys rather than retyping
 * them anywhere else.
 */
export const PAGES = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'study-abroad', label: 'Study Abroad', path: '/study-abroad' },
  { key: 'universities', label: 'Universities', path: '/universities' },
  { key: 'services', label: 'Services', path: '/services' },
  { key: 'scholarships', label: 'Scholarships', path: '/scholarships' },
  { key: 'test-preparation', label: 'Test Preparation', path: '/test-preparation' },
  { key: 'success-stories', label: 'Success Stories', path: '/success-stories' },
  { key: 'blogs', label: 'Blog', path: '/blogs' },
  { key: 'about', label: 'About Us', path: '/about' },
  { key: 'contact', label: 'Contact', path: '/contact' },
  { key: 'student-visa', label: 'Student Visa', path: '/student-visa' },
  { key: 'course-finder', label: 'Course Finder', path: '/course-finder' },
  { key: 'team', label: 'Our Team', path: '/team' },
  { key: 'privacy-policy', label: 'Privacy Policy', path: '/privacy-policy' },
  { key: 'terms-conditions', label: 'Terms & Conditions', path: '/terms-conditions' },
  { key: 'disclaimer', label: 'Disclaimer', path: '/disclaimer' },
];

export const PAGE_KEYS = PAGES.map((page) => page.key);

export const findPage = (key) => PAGES.find((page) => page.key === key);

export default PAGES;
