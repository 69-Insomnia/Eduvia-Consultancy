import 'dotenv/config';
import { Sequelize } from 'sequelize';

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('[db] SUPABASE_DB_URL is not set — API requests will return 503');
}

// When the env var is missing we still need a syntactically valid URL so that
// importing this module (e.g. during `next build`) never crashes the process.
// ensureDb() rejects before any query runs in that case.
const sequelize = new Sequelize(url || 'postgresql://127.0.0.1:1/unavailable', {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

let connectPromise: Promise<void> | null = null;

const connectDB = async (): Promise<void> => {
  if (!process.env.SUPABASE_DB_URL) {
    throw new Error('SUPABASE_DB_URL is not set');
  }
  if (!connectPromise) {
    connectPromise = sequelize
      .authenticate()
      .then(() => {
        const host = (() => {
          try {
            return new URL(process.env.SUPABASE_DB_URL).host;
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
