'use client';

import StructuredData from './StructuredData';

/**
 * Per-page structured data.
 *
 * The title/description/canonical/Open Graph props are still accepted because
 * every view builds them (often from the admin's per-page SEO override), but
 * they are no longer rendered here: head tags emitted by react-helmet-async
 * never reached the document head in the App Router, so they are now produced
 * server-side by `generateMetadata` (`server/services/pageMetadata.ts`) from the
 * same `page_seo` rows and `utils/pageSeoDefaults` copy the views read.
 *
 * JSON-LD is the part that still has to ship from the page itself — the graph
 * depends on data that only the view has (breadcrumbs, FAQs, the article's own
 * dates) — so it renders directly into the HTML body.
 */
export default function SEO({ jsonLd, ..._headProps }: any) {
  return <StructuredData data={jsonLd} />;
}
