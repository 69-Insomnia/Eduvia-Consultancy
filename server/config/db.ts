import 'dotenv/config';
import { Sequelize } from 'sequelize';
// Sequelize loads the driver with a dynamic require("pg") that Vercel's file
// tracer cannot follow, so the serverless bundle would lack node_modules/pg
// and crash at import. Import it here (statically traced) and hand it over.
import pg from 'pg';

// Postgres endpoint for this deployment. Three names are accepted so `.env`
// can use whichever convention it was generated with: Supabase's CLI writes
// `POOLER_URL`/`DATABASE_URL`, older copies of this file used `SUPABASE_DB_URL`.
// Order matters — the transaction pooler first, direct connection last.
export const dbUrl =
  process.env.SUPABASE_DB_URL || process.env.POOLER_URL || process.env.DATABASE_URL || '';

const requestedPoolMax = Number(process.env.DB_POOL_MAX || 1);
const poolMax = Number.isInteger(requestedPoolMax) && requestedPoolMax > 0 ? requestedPoolMax : 1;
if (!dbUrl) {
  console.error('[db] no database URL set (SUPABASE_DB_URL / POOLER_URL / DATABASE_URL) — API requests will return 503');
}

// When the env var is missing we still need a syntactically valid URL so that
// importing this module (e.g. during `next build`) never crashes the process.
// ensureDb() rejects before any query runs in that case.
const sequelize = new Sequelize(dbUrl || 'postgresql://127.0.0.1:1/unavailable', {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  // Vercel can create many serverless instances; keep each instance's pool
  // small to avoid multiplying connections against Supabase's pooler.
  pool: { max: poolMax, min: 0, acquire: 30000, idle: 10000 },
});

let connectPromise: Promise<void> | null = null;

const connectDB = async (): Promise<void> => {
  if (!dbUrl) {
    throw new Error('No database URL set (SUPABASE_DB_URL / POOLER_URL / DATABASE_URL)');
  }
  if (!connectPromise) {
    connectPromise = sequelize
      .authenticate()
      .then(() => {
        const host = (() => {
          try {
            return new URL(dbUrl).host;
          } catch {
            return 'supabase';
          }
        })();
        console.log(`PostgreSQL Connected: ${host}`);
      })
      .catch((error) => {
        connectPromise = null;
        throw error;
      });
  }
  return connectPromise;
};

export { sequelize, connectDB };
export default connectDB;
