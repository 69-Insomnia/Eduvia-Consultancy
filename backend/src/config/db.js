import 'dotenv/config';
import { Sequelize } from 'sequelize';

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('Missing SUPABASE_DB_URL in environment');
  process.exit(1);
}

const sequelize = new Sequelize(url, {
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

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    const host = (() => {
      try {
        return new URL(url).host;
      } catch {
        return 'supabase';
      }
    })();
    console.log(`PostgreSQL Connected: ${host}`);
  } catch (error) {
    console.error(`PostgreSQL connection error: ${error.message}`);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
