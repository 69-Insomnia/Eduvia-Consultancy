import { SITE_URL } from '../common/StructuredData';
import FormField, { INPUT_CLASS } from './FormField';

/**
 * Shared SEO editor used by every admin content form.
 *
 * The forms previously carried flat `seoTitle` / `seoDescription` / `seoKeywords`
 * keys, which are not schema paths — Mongoose runs `strict: true`, so those
 * inputs were silently dropped on save and the SEO panel never persisted
 * anything. This component writes to the real nested `seo` subdocument, and the
 * helpers below convert between the stored shape and the form shape.
 *
 * Every field is an *override*. Leaving one empty is a valid choice and means
 * "use the default", so the UI says so explicitly rather than leaving the editor
 * guessing whether they have broken something.
 */

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

/** Form state for a document with no SEO authored yet. Keywords are a string here. */
export const EMPTY_SEO = {
  title: '',
  description: '',
  keywords: '',
  canonical: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  robots: 'index,follow',
  focusKeyword: '',
};

/**
 * Stored `seo` subdocument -> form state. Keywords become a comma-separated
 * string because that is what the inputs edit.
 */
export function seoToForm(seo) {
  return {
    ...EMPTY_SEO,
    ...(seo || {}),
    keywords: Array.isArray(seo?.keywords) ? seo.keywords.join(', ') : seo?.keywords || '',
  };
}

/**
 * Form state -> request payload. Empty strings are stripped so an untouched
 * field stays absent and the frontend can fall back to its template, rather
 * than overwriting a good value with ''.
 */
export function seoToPayload(seoForm) {
  if (!seoForm) return undefined;
  const payload = {};
  for (const [key, value] of Object.entries(seoForm)) {
    if (key === 'keywords') {
      const list = String(value || '')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
      if (list.length) payload.keywords = list;
      continue;
    }
    if (value !== '' && value !== undefined && value !== null) payload[key] = value;
  }
  return payload;
}

function CharCount({ value, max }) {
  const length = (value || '').length;
  if (!length) return null;

  const over = length > max;
  return (
    <span className={`ml-auto text-xs font-medium tabular-nums ${over ? 'text-accent-600' : 'text-dark-400'}`}>
      {length}/{max}
      {over && <span className="ml-1 font-normal">— will be truncated</span>}
    </span>
  );
}

function SerpPreview({ title, description, url }) {
  const displayUrl = (url || SITE_URL).replace(/^https?:\/\//, '');

  return (
    <div className="rounded-xl border border-dark-200 bg-white p-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dark-400">
        Search result preview
      </p>
      <p className="truncate text-xs text-dark-500">{displayUrl}</p>
      {/* Google renders titles ~60 and descriptions ~160 characters before
          cutting them off; the counters above warn at the same limits. */}
      <p className="truncate text-[17px] leading-snug text-[#1a0dab]">
        {title || 'Untitled page'}
      </p>
      <p className="line-clamp-2 text-sm leading-snug text-dark-600">
        {description || 'No description set — search engines will use the page default.'}
      </p>
    </div>
  );
}

export default function SeoFields({
  value,
  onChange,
  title = 'SEO',
  previewUrl,
  fallbackTitle,
  fallbackDescription,
}) {
  const seo = value || EMPTY_SEO;
  const set = (field) => (e) => onChange(field, e.target.value);

  const fallbackNote = (text) =>
    text ? `Empty — will fall back to: ${text}` : 'Empty — the page default will be used.';

  return (
    <fieldset className="border border-dark-200/70 rounded-xl p-4">
      <legend className="px-2 text-sm font-medium text-dark-700">{title}</legend>

      <div className="space-y-4">
        <SerpPreview title={seo.title} description={seo.description} url={previewUrl} />

        <div>
          <div className="flex items-baseline">
            <label htmlFor="seo-title" className="text-sm font-medium text-dark-700">
              Meta Title
            </label>
            <CharCount value={seo.title} max={TITLE_MAX} />
          </div>
          <input
            id="seo-title"
            type="text"
            value={seo.title}
            onChange={set('title')}
            className={`${INPUT_CLASS} mt-1.5`}
            placeholder="Leave empty to use the default title"
          />
          {!seo.title && (
            <p className="mt-1 text-xs text-dark-400">{fallbackNote(fallbackTitle)}</p>
          )}
        </div>

        <div>
          <div className="flex items-baseline">
            <label htmlFor="seo-description" className="text-sm font-medium text-dark-700">
              Meta Description
            </label>
            <CharCount value={seo.description} max={DESCRIPTION_MAX} />
          </div>
          <textarea
            id="seo-description"
            value={seo.description}
            onChange={set('description')}
            rows={3}
            className={`${INPUT_CLASS} mt-1.5 resize-none`}
            placeholder="Leave empty to use the default description"
          />
          {!seo.description && (
            <p className="mt-1 text-xs text-dark-400">{fallbackNote(fallbackDescription)}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField
            label="Keywords"
            id="seo-keywords"
            value={seo.keywords}
            onChange={set('keywords')}
            placeholder="study abroad, student visa"
            hint="Comma separated. Search engines largely ignore this; it is kept for reference."
          />
          <FormField
            label="Focus Keyword"
            id="seo-focus"
            value={seo.focusKeyword}
            onChange={set('focusKeyword')}
            placeholder="study in australia"
            hint="The phrase this page should rank for."
          />
        </div>

        <details className="group">
          <summary className="cursor-pointer list-none text-sm font-medium text-primary-600 hover:text-primary-700">
            Advanced
          </summary>
          <div className="space-y-3 pt-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Canonical URL"
                id="seo-canonical"
                type="url"
                value={seo.canonical}
                onChange={set('canonical')}
                placeholder="Defaults to this page's own URL"
              />
              <FormField
                label="Social Image URL"
                id="seo-og-image"
                type="url"
                value={seo.ogImage}
                onChange={set('ogImage')}
                placeholder="/og-image.jpg"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                label="Social Title"
                id="seo-og-title"
                value={seo.ogTitle}
                onChange={set('ogTitle')}
                placeholder="Falls back to the meta title"
              />
              <FormField
                label="Search Engine Visibility"
                id="seo-robots"
                as="select"
                value={seo.robots}
                onChange={set('robots')}
                options={[
                  { value: 'index,follow', label: 'Index and follow links' },
                  { value: 'noindex,follow', label: 'No index, follow links' },
                  { value: 'noindex,nofollow', label: 'No index, no follow' },
                ]}
              />
            </div>
            <FormField
              label="Social Description"
              id="seo-og-description"
              as="textarea"
              rows={2}
              value={seo.ogDescription}
              onChange={set('ogDescription')}
              placeholder="Falls back to the meta description"
            />
          </div>
        </details>
      </div>
    </fieldset>
  );
}
