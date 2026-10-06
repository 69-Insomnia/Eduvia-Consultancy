/**
 * Canonical SEO field definitions, shared by every content model that has a
 * public page of its own.
 *
 * Deliberately a factory returning plain path definitions rather than a
 * `mongoose.Schema`: a nested schema would attach an `_id` and a document
 * prototype, and every content controller in this codebase writes through
 * `Model.create(req.body)` / `findByIdAndUpdate(id, req.body)` untouched.
 * Plain nested paths keep that passthrough working with no controller changes.
 *
 * Every field is flat on purpose. `settingsController.updateSettings` merges
 * exactly one level deep, so a nested object here (e.g. `robots: {index,
 * follow}`) would be replaced wholesale on every partial save instead of
 * having a single key updated.
 *
 * No defaults, also on purpose: the frontend falls back to a template when a
 * field is absent, and a default would make an unoptimized document look
 * authored.
 */
export const seoFields = () => ({
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  keywords: [{ type: String }],
  canonical: { type: String, trim: true },
  ogTitle: { type: String, trim: true },
  ogDescription: { type: String, trim: true },
  ogImage: { type: String, trim: true },
  ogType: { type: String, default: 'website' },
  // Single string ('index,follow' / 'noindex,nofollow') so it maps 1:1 onto
  // <meta name="robots"> and survives the shallow settings merge.
  robots: { type: String, default: 'index,follow' },
  schemaType: { type: String, trim: true },
  focusKeyword: { type: String, trim: true },
});

export default seoFields;
