import 'server-only';
import { Pool } from 'pg';

const globalDb = globalThis as unknown as {
  bazarPostgres?: Pool;
};

function connect() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing from .env.local');
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 15_000,
  });
}

export const db = globalDb.bazarPostgres ?? connect();

globalDb.bazarPostgres = db;