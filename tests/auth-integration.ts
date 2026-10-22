import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { getMigrations } from 'better-auth/db/migration';

async function main() {
  // Tests must use a separate test database.
  const testUrl = process.env.TEST_DATABASE_URL;
  if (!testUrl || testUrl === process.env.DATABASE_URL) {
    throw new Error(
      'Set TEST_DATABASE_URL to a separate test database before running this test.',
    );
  }

  process.env.DATABASE_URL = testUrl;
  process.env.BETTER_AUTH_SECRET =
    'integration-test-only-secret-never-use-in-production-18927';
  process.env.BETTER_AUTH_URL = 'http://localhost:3000';

  const { auth } = await import('../src/lib/auth');
  const { db } = await import('../src/lib/db');

  const base = 'http://localhost:3000';
  const email = `test-${randomUUID()}@example.test`;
  const password = `Test!${randomUUID()}`;
  let cookies = '';

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
    if (set.length) {
      cookies = set.map((value) => value.split(';')[0]).join('; ');
    }

    return { response, data: await response.json() };
  }

  try {
    const migrations = await getMigrations(auth.options);
    await migrations.runMigrations();

    let result = await call('/sign-up/email', {
      name: 'Test User',
      email,
      password,
    });
    assert.equal(result.response.status, 200);
    assert.equal(cookies, '', 'Registration must not auto sign in');

    result = await call('/sign-in/email', {
      email,
      password: 'incorrect-password',
    });
    assert.equal(result.response.status, 401);

    result = await call('/sign-in/email', { email, password });
    assert.equal(result.response.status, 200);
    assert(cookies.includes('session_token'));

    result = await call('/get-session');
    assert.equal(result.data.user.email, email);

    result = await call('/update-user', { name: 'Updated User' });
    assert.equal(result.response.status, 200);

    result = await call('/get-session');
    assert.equal(result.data.user.name, 'Updated User');

    const stored = await db.query(
      `SELECT a.password FROM account a
       JOIN "user" u ON u.id = a."userId"
       WHERE u.email = $1 AND a."providerId" = $2`,
      [email, 'credential'],
    );
    assert.equal(stored.rows.length, 1);
    assert(stored.rows[0].password);
    assert.notEqual(stored.rows[0].password, password);

    result = await call('/sign-out', {});
    assert.equal(result.response.status, 200);

    cookies = '';
    result = await call('/get-session');
    assert.equal(result.data, null);

    console.log('PASS: PostgreSQL authentication and profile update.');
  } finally {
    try {
      await db.query('DELETE FROM "user" WHERE email = $1', [email]);
    } finally {
      await db.end();
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});