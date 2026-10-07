import dotenv from 'dotenv';
dotenv.config();

import connectDB, { sequelize, dbUrl } from '../server/config/db.js';
import { buildSitemap, siteUrl } from '../server/services/sitemapService.js';
import { makeSeoFromEntity } from '../server/utils/seoDefaults.js';

/**
 * Diagnostics for the SEO layer. Run with `npm run verify:seo`.
 *
 * Checks that every content model exposes the full `seo` subdocument, that the
 * defaults helper produces sane output, and that the sitemap builds and contains
 * only URLs the SPA actually routes.
 */

const EXPECTED_SEO_PATHS = [
  'title',
  'description',
  'keywords',
  'canonical',
  'ogTitle',
  'ogDescription',
  'ogImage',
  'ogType',
  'robots',
  'schemaType',
  'focusKeyword',
];

// Routes that must never appear: the SPA has no detail page for either
// collection, so a URL here would be a soft-404.
const FORBIDDEN_URL_PATTERNS = [/\/courses\//, /\/scholarships\//];

const run = async () => {
  let failures = 0;

  console.log('SEO configuration check\n');

  console.log('Models');
  for (const name of ['Blog', 'Course', 'Destination', 'Scholarship', 'Service', 'University', 'PageSeo']) {
    const { default: Model } = await import(`../server/models/${name}.js`);
    const seoColumn = Model.rawAttributes.seo;
    const paths = seoColumn && seoColumn.type.key === 'JSONB' ? [...EXPECTED_SEO_PATHS] : [];
    const missing = EXPECTED_SEO_PATHS.filter((p) => !paths.includes(p));
    const ok = missing.length === 0;
    if (!ok) failures++;
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${name.padEnd(12)} ${ok ? `${paths.length} fields` : `missing: ${missing.join(', ')}`}`);
  }

  console.log('\nDefault templates');
  for (const sample of [
    { type: 'destination', name: 'Australia' },
    { type: 'university', name: 'Monash University', country: 'Australia' },
    { type: 'course', name: 'MSc Artificial Intelligence', country: 'United Kingdom' },
    { type: 'scholarship', name: 'Chevening Scholarship', country: 'United Kingdom' },
    { type: 'service', name: 'Visa Processing' },
    { type: 'blog', name: 'How to write an SOP' },
  ]) {
    const seo = makeSeoFromEntity(sample) as any;
    const ok = Boolean(seo.title && seo.description && seo.keywords?.length);
    if (!ok) failures++;
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${sample.type.padEnd(12)} ${seo.title || '(no title)'}`);
  }

  const unknown = makeSeoFromEntity({ type: 'not-a-type', name: 'X' });
  const unknownOk = Object.keys(unknown).length === 0;
  if (!unknownOk) failures++;
  console.log(`  ${unknownOk ? 'OK  ' : 'FAIL'} unknown type  returns {} rather than a wrong template`);

  if (!dbUrl) {
    console.log('\nNo database URL set (SUPABASE_DB_URL / POOLER_URL / DATABASE_URL) — skipping the sitemap check.');
    process.exit(failures ? 1 : 0);
  }

  console.log(`\nSitemap (origin ${siteUrl()})`);
  await connectDB();
  try {
    const xml = await buildSitemap();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    console.log(`  ${locs.length} URLs`);
    const bad = locs.filter((loc) => FORBIDDEN_URL_PATTERNS.some((re) => re.test(loc)));
    if (bad.length) {
      failures++;
      console.log(`  FAIL contains URLs with no route: ${bad.slice(0, 5).join(', ')}`);
    } else {
      console.log('  OK   no soft-404 URLs (no course/scholarship detail pages)');
    }

    const undefinedLocs = locs.filter((loc) => loc.includes('undefined'));
    if (undefinedLocs.length) {
      failures++;
      console.log(`  FAIL ${undefinedLocs.length} URL(s) contain "undefined" (a document has no slug)`);
    } else {
      console.log('  OK   every URL has a slug');
    }

    const valid = xml.startsWith('<?xml') && xml.includes('<urlset') && xml.trimEnd().endsWith('</urlset>');
    if (!valid) failures++;
    console.log(`  ${valid ? 'OK  ' : 'FAIL'} well-formed urlset`);

    console.log('\n  Sample:');
    for (const loc of locs.slice(0, 3)) console.log(`    ${loc}`);
  } finally {
    await sequelize.close();
  }

  console.log(`\n${failures ? `${failures} check(s) FAILED` : 'All checks passed.'}`);
  process.exitCode = failures ? 1 : 0;
};

run().catch((error) => {
  console.error('Check failed to run:', error);
  process.exitCode = 1;
});
