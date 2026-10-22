// In-process HTTP contract test, using an isolated SQLite database (no server required).
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
async function main() {
  const dir = mkdtempSync(join(tmpdir(), 'bazar-auth-'));
  process.env.DATABASE_PATH = join(dir, 'test.db');
  process.env.BETTER_AUTH_SECRET = 'integration-test-only-secret-never-use-in-production-18927';
  process.env.BETTER_AUTH_URL = 'http://localhost:3000';
  const { auth } = await import('../src/lib/auth');
  const { db } = await import('../src/lib/db');
  let cookies = '';
  const base = 'http://localhost:3000';
  async function call(path: string, body?: Record<string, string>) {
    const response = await auth.handler(
      new Request(`${base}/api/auth${path}`, {
        method: body ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          Origin: base,
          ...(cookies ? { Cookie: cookies } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      }),
    );
    const set = response.headers.getSetCookie();
    if (set.length) cookies = set.map((v) => v.split(';')[0]).join('; ');
    const data = await response.json();
    return { response, data };
  }
  try {
    let r = await call('/sign-up/email', {
      name: 'পরীক্ষার ব্যবহারকারী',
      email: 'smoke@example.test',
      password: 'BazarTest!892734',
    });
    assert.equal(r.response.status, 200, JSON.stringify(r.data));
    assert.equal(cookies, '', 'Registration must not auto sign in');
    r = await call('/sign-in/email', {
      email: 'smoke@example.test',
      password: 'incorrect-password',
    });
    assert.equal(r.response.status, 401);
    r = await call('/sign-in/email', { email: 'smoke@example.test', password: 'BazarTest!892734' });
    assert.equal(r.response.status, 200, JSON.stringify(r.data));
    assert(cookies.includes('session_token'));
    r = await call('/get-session');
    assert.equal(r.data.user.name, 'পরীক্ষার ব্যবহারকারী');
    r = await call('/update-user', { name: 'আপডেট করা নাম' });
    assert.equal(r.response.status, 200, JSON.stringify(r.data));
    r = await call('/get-session');
    assert.equal(r.data.user.name, 'আপডেট করা নাম');
    assert.notEqual(
      db.prepare('SELECT password FROM account').get() &&
        (db.prepare('SELECT password FROM account').get() as { password: string }).password,
      'BazarTest!892734',
    );
    r = await call('/sign-out', {});
    assert.equal(r.response.status, 200);
    cookies = '';
    r = await call('/get-session');
    assert.equal(r.data, null);
    console.log(
      'PASS: SQLite, signup without auto-login, password hashing, wrong-password rejection, sign-in cookie, session, profile update, sign-out.',
    );
  } finally {
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
