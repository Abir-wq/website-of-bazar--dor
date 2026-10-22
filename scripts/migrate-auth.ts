import { getMigrations } from 'better-auth/db/migration';
import { auth } from '../src/lib/auth';
import { db } from '../src/lib/db';

async function main() {
  try {
    const migrations = await getMigrations(auth.options);
    await migrations.runMigrations();
    console.log('Success: Neon authentication tables are ready.');
  } finally {
    await db.end();
  }
}

main().catch(() => {
  console.error('Migration failed. Check the database connection and configuration.');
  process.exitCode = 1;
});