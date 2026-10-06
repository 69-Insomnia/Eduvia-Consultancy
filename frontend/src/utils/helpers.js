export function formatDate(date, options) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(
    'en-US',
    options || { year: 'numeric', month: 'long', day: 'numeric' }
  );
}

/**
 * Compact date for cards and tables. Returns `fallback` for missing or
 * unparseable values so the UI never renders a literal "Invalid Date".
 */
export function formatDateShort(date, fallback = '—') {
  if (!date) return fallback;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US');
}

export function getTimeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Map a `/success-stories` record onto the shape the story cards render.
 *
 * The API names these for the record it stores — `studentName`, `testimonial`,
 * `photo` — while TestimonialCard and the SuccessStories grid were written
 * against generic names that never existed on the response. Every card rendered
 * with its stars, course and country but no name and no quote. Normalising once
 * here keeps both consumers honest; the generic names win when a caller passes
 * an already-mapped record.
 */
export function normalizeStory(story) {
  if (!story) return null;
  return {
    ...story,
    name: story.name || story.studentName || '',
    quote: story.quote || story.testimonial || '',
    image: story.image || story.photo || '',
  };
}

export function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}
