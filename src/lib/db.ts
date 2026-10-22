import 'server-only';
import Database from 'better-sqlite3';
import {mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
const globalDb=globalThis as unknown as {bazarDatabase?:Database.Database};
function connect(){
 const path=resolve(process.env.DATABASE_PATH || './data/bazar-dor.db');
 mkdirSync(dirname(path),{recursive:true});
 const db=new Database(path); db.pragma('journal_mode = WAL'); db.pragma('foreign_keys = ON');
 db.exec(`
 CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY NOT NULL,"name" TEXT NOT NULL,"email" TEXT NOT NULL UNIQUE,
  "emailVerified" INTEGER NOT NULL DEFAULT 0,"image" TEXT,"createdAt" DATETIME NOT NULL,"updatedAt" DATETIME NOT NULL
 );
 CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY NOT NULL,"expiresAt" DATETIME NOT NULL,"token" TEXT NOT NULL UNIQUE,
  "createdAt" DATETIME NOT NULL,"updatedAt" DATETIME NOT NULL,"ipAddress" TEXT,"userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
 );
 CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session"("userId");
 CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY NOT NULL,"accountId" TEXT NOT NULL,"providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,"refreshToken" TEXT,"idToken" TEXT,"accessTokenExpiresAt" DATETIME,
  "refreshTokenExpiresAt" DATETIME,"scope" TEXT,"password" TEXT,"createdAt" DATETIME NOT NULL,"updatedAt" DATETIME NOT NULL
 );
 CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account"("userId");
 CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY NOT NULL,"identifier" TEXT NOT NULL,"value" TEXT NOT NULL,
  "expiresAt" DATETIME NOT NULL,"createdAt" DATETIME NOT NULL,"updatedAt" DATETIME NOT NULL
 );
 CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification"("identifier");
 `);
 return db;
}
export const db=globalDb.bazarDatabase ?? connect();
globalDb.bazarDatabase=db;
