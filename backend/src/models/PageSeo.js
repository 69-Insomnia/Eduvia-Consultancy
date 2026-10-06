import mongoose from 'mongoose';
import seoFields from './schemas/seoFields.js';

/**
 * SEO overrides for the site's own pages (About, Contact, Privacy Policy, …).
 *
 * Entity pages get their SEO from their own document (a University carries its
 * own `seo`), but static pages have no document to hang it on — before this
 * model their metadata was hardcoded in JSX and needed a deploy to change.
 *
 * One row per page, keyed by the strings in `src/config/pages.js`. A row that is
 * missing or has no `title` means "use the page's built-in default", which is
 * why nothing here has a default value.
 */
const pageSeoSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Page key is required'],
      unique: true,
      trim: true,
    },
    label: {
      type: String,
      trim: true,
    },
    path: {
      type: String,
      trim: true,
    },
    seo: seoFields(),
  },
  { timestamps: true }
);

const PageSeo = mongoose.model('PageSeo', pageSeoSchema);
export default PageSeo;
