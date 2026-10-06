import dotenv from 'dotenv';
dotenv.config();

import connectDB, { sequelize } from '../src/config/db.js';
import University from '../src/models/University.js';
import Course from '../src/models/Course.js';
import Destination from '../src/models/Destination.js';
import Scholarship from '../src/models/Scholarship.js';
import Service from '../src/models/Service.js';
import Blog from '../src/models/Blog.js';
import { makeSeoFromEntity } from '../src/utils/seoDefaults.js';

/**
 * Fills the `seo` block on documents that do not have one yet.
 *
 * The seed script and the bulk importers now generate SEO on creation, but the
 * importers skip documents that already exist — so anything loaded before that
 * change stays without it. This fills only the gaps and never overwrites SEO an
 * editor has authored in the admin.
 *
 * Uses findAll() plus save() rather than updateMany because the values are
 * computed per document from its own fields. It never touches slugs.
 */

const TARGETS = [
  { label: 'University', model: University, type: 'university', nameOf: (d) => d.name, countryOf: (d) => d.country },
  { label: 'Course', model: Course, type: 'course', nameOf: (d) => d.name, countryOf: (d) => d.countries?.[0] },
  { label: 'Destination', model: Destination, type: 'destination', nameOf: (d) => d.name },
  { label: 'Scholarship', model: Scholarship, type: 'scholarship', nameOf: (d) => d.name, countryOf: (d) => d.country },
  { label: 'Service', model: Service, type: 'service', nameOf: (d) => d.title },
  { label: 'Blog', model: Blog, type: 'blog', nameOf: (d) => d.title },
];

const run = async () => {
  try {
    await connectDB();
    console.log('PostgreSQL connected.');

    let totalUpdated = 0;

    for (const { label, model, type, nameOf, countryOf } of TARGETS) {
      let updated = 0;
      let skipped = 0;

      for (const doc of await model.findAll()) {
        if (doc.seo?.title) {
          skipped++;
          continue;
        }

        const seo = makeSeoFromEntity({
          type,
          name: nameOf(doc),
          country: countryOf ? countryOf(doc) : undefined,
        });

        if (!Object.keys(seo).length) {
          skipped++;
          continue;
        }

        doc.seo = { ...(doc.seo || {}), ...seo };
        await doc.save();
        updated++;
      }

      totalUpdated += updated;
      console.log(`  ${label.padEnd(12)} ${updated} updated, ${skipped} already had SEO`);
    }

    console.log(`\nDone. ${totalUpdated} document(s) updated.`);
  } catch (error) {
    console.error('Backfill failed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
