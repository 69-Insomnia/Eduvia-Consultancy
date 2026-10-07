import dotenv from 'dotenv';
dotenv.config();

import fs from 'node:fs';
import path from 'node:path';
import connectDB from '../server/config/db.js';
import University from '../server/models/University.js';
import Blog from '../server/models/Blog.js';
import Destination from '../server/models/Destination.js';
import Service from '../server/models/Service.js';
import SuccessStory from '../server/models/SuccessStory.js';
import TeamMember from '../server/models/TeamMember.js';
import Testimonial from '../server/models/Testimonial.js';
import SiteSettings from '../server/models/SiteSettings.js';

/**
 * Repairs image paths that point at files this deployment does not ship.
 *
 * The seed script and the early bulk importers wrote paths like
 * `/images/unis/toronto-cover.jpg` for artwork that was never added to
 * `public/`, so every card requested a file that could not exist: the optimizer
 * answered 400, raw <img> answered 404, and the card fell back to stock
 * photography after a wasted round trip.
 *
 * For each site-relative path that is missing it tries, in order:
 *   1. the same file name inside the record's own folder (`/blogs/x.jpg`),
 *   2. a file named after the record's slug inside that folder
 *      (`/universities/university-of-toronto.jpg`) — covers only, since the
 *      seeded `<short>-cover.jpg` names do not match anything on disk,
 *   3. clearing the value, so the card renders its designed empty state
 *      instead of requesting a 404.
 *
 * Absolute URLs (Cloudinary, Supabase Storage, Unsplash) are never touched.
 *
 *   npx tsx scripts/fix-image-paths.ts          # dry run: print the plan
 *   npx tsx scripts/fix-image-paths.ts --apply  # write the changes
 */

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const APPLY = process.argv.includes('--apply');

const isLocalPath = (value: any): value is string =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');

const fileExists = (publicPath: string) =>
  fs.existsSync(path.join(PUBLIC_DIR, publicPath.replace(/^\//, '')));

type ResolveOptions = { folder?: string; slug?: string; bySlug?: boolean };

function resolvePath(current: string, opts: ResolveOptions): string | null {
  const { folder, slug, bySlug } = opts;
  if (folder) {
    const byBasename = `/${folder}/${path.basename(current)}`;
    if (fileExists(byBasename)) return byBasename;
    if (bySlug && slug) {
      for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
        const candidate = `/${folder}/${slug}${ext}`;
        if (fileExists(candidate)) return candidate;
      }
    }
  }
  return null;
}

const changes: { label: string; field: string; from: string; to: string | null }[] = [];

function clearValueFor(model: any, field: string) {
  const attribute = model.rawAttributes?.[field];
  // NOT NULL string columns take an empty string; everything else takes null.
  return attribute && attribute.allowNull === false && attribute.type?.key === 'STRING' ? '' : null;
}

async function repair(
  model: any,
  label: string,
  rows: any[],
  fields: { name: string; opts?: ResolveOptions }[]
) {
  for (const row of rows) {
    for (const { name, opts = {} } of fields) {
      const current = row[name];
      if (!isLocalPath(current) || fileExists(current)) continue;

      const next = resolvePath(current, { ...opts, slug: opts.slug ?? row.slug });
      if (next === current) continue;

      changes.push({ label: `${label} ${row.slug || row.id}`, field: name, from: current, to: next });

      if (APPLY) {
        row[name] = next ?? clearValueFor(model, name);
        await row.save();
      }
    }
  }
}

async function run() {
  await connectDB();

  await repair(University, 'university', await University.findAll(), [
    { name: 'coverImage', opts: { folder: 'universities', bySlug: true } },
    // There is no logo artwork under public/universities — only campus photos —
    // so a dead logo path clears rather than pointing at a cover photo.
    { name: 'logo', opts: { folder: 'universities' } },
  ]);

  await repair(Blog, 'blog', await Blog.findAll({ attributes: ['id', 'slug', 'featuredImage'] }), [
    { name: 'featuredImage', opts: { folder: 'blogs' } },
  ]);

  await repair(Destination, 'destination', await Destination.findAll(), [
    { name: 'image', opts: { folder: 'destinations' } },
    { name: 'coverImage', opts: { folder: 'destinations' } },
  ]);

  await repair(Service, 'service', await Service.findAll(), [{ name: 'image' }]);
  await repair(SuccessStory, 'success-story', await SuccessStory.findAll(), [{ name: 'photo' }]);
  await repair(TeamMember, 'team-member', await TeamMember.findAll(), [{ name: 'avatar' }]);
  await repair(Testimonial, 'testimonial', await Testimonial.findAll(), [{ name: 'image' }]);

  const settings: any = await SiteSettings.findOne();
  if (settings) {
    for (const field of ['logo', 'backgroundImage', 'ogImage']) {
      const current = settings[field];
      if (!isLocalPath(current) || fileExists(current)) continue;
      changes.push({ label: 'settings', field, from: current, to: null });
      if (APPLY) {
        settings[field] = clearValueFor(SiteSettings, field);
        await settings.save();
      }
    }
  }

  if (!changes.length) {
    console.log('All stored image paths resolve to files in public/. Nothing to do.');
    return;
  }

  console.log(`${APPLY ? 'Fixed' : 'Would fix'} ${changes.length} broken image path(s):\n`);
  for (const change of changes) {
    console.log(
      `  ${change.label.padEnd(40)} ${change.field.padEnd(14)} ${change.from} -> ${change.to ?? '(cleared)'}`
    );
  }
  if (!APPLY) console.log('\nDry run. Re-run with --apply to write these changes.');
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
