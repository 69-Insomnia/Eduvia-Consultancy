import 'dotenv/config';
import { sequelize } from '../server/config/db.js';

await sequelize.authenticate();

// 1. Confirm the table actually exists.
const [tables]: any = await sequelize.query(
  `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='seo_meta'`
);
if (!tables.length) {
  console.log('[seo-meta] table MISSING — creating it now...');
  const { readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const path = await import('node:path');
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const sql = readFileSync(
    path.join(dir, '..', 'supabase', 'migrations', '20261010120000_seo_meta.sql'),
    'utf8'
  );
  await sequelize.query(sql);
  console.log('[seo-meta] table created.');
} else {
  console.log('[seo-meta] table exists in Postgres.');
}

// 2. Reload PostgREST's schema cache so the Supabase API layer (Table Editor,
//    PostgREST, supabase-js) sees the table. Running DDL through the pooler
//    does not always fire Supabase's automatic reload trigger.
await sequelize.query(`NOTIFY pgrst, 'reload schema';`);
console.log('[seo-meta] PostgREST schema cache reload notified.');

// 3. Sanity-read the table through plain SQL.
const [rows]: any = await sequelize.query(`SELECT count(*)::int AS n FROM public.seo_meta`);
console.log(`[seo-meta] row count: ${rows[0].n}`);

await sequelize.close();
