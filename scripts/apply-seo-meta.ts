import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { sequelize } from '../server/config/db.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(
  path.join(dir, '..', 'supabase', 'migrations', '20261010120000_seo_meta.sql'),
  'utf8'
);

await sequelize.authenticate();
await sequelize.query(sql);
const [rows]: any = await sequelize.query(
  `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='seo_meta' ORDER BY ordinal_position`
);
console.log('[seo-meta] table ready:');
for (const r of rows) console.log(`  ${r.column_name}: ${r.data_type}`);
await sequelize.close();
