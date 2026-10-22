// Run against an already running local app: npm run test:smoke
// Creates a temporary account and deletes it directly from the local SQLite database afterwards.
import assert from 'node:assert/strict';
import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;
import Database from 'better-sqlite3';
loadEnvConfig(process.cwd());
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const email = `smoke-${Date.now()}@example.test`,
  password = 'BazarTest!892734';
let cookies = '';
async function api(path, body) {
  const res = await fetch(base + path, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Origin: process.env.BETTER_AUTH_URL || base,
      ...(cookies ? { Cookie: cookies } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });
  const set = res.headers.getSetCookie();
  if (set.length) cookies = set.map((v) => v.split(';')[0]).join('; ');
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { res, data };
}
try {
  for (const path of ['/', '/category/chal', '/signin', '/signup']) {
    const res = await fetch(base + path);
    assert.equal(res.status, 200, path);
  }
  for (const path of ['/category/invalid', '/product/unknown']) {
    const res = await fetch(base + path);
    assert([200, 404].includes(res.status));
    assert((await res.text()).includes('দুঃখিত, কিছু পাওয়া যায়নি'));
  }
  for (const path of ['/product/miniket-chal', '/profile']) {
    const res = await fetch(base + path, { redirect: 'manual' });
    const text = await res.text();
    assert(
      (res.status === 307 && res.headers.get('location')?.startsWith('/signin?reason=protected')) ||
        (res.status === 200 &&
          text.includes('NEXT_REDIRECT') &&
          text.includes('/signin?reason=protected')),
      path,
    );
  }
  let result = await api('/api/auth/sign-up/email', {
    name: 'পরীক্ষার ব্যবহারকারী',
    email,
    password,
  });
  assert.equal(result.res.status, 200, JSON.stringify(result.data));
  cookies = '';
  result = await api('/api/auth/sign-in/email', { email, password: 'wrong-password' });
  assert(result.res.status >= 400);
  result = await api('/api/auth/sign-in/email', { email, password });
  assert.equal(result.res.status, 200, JSON.stringify(result.data));
  assert(cookies.includes('session_token'));
  result = await api('/api/auth/get-session');
  assert.equal(result.data.user.email, email);
  for (const path of ['/product/miniket-chal', '/profile', '/profile/update']) {
    const res = await fetch(base + path, { headers: { Cookie: cookies } });
    assert.equal(res.status, 200, path);
    const html = await res.text();
    assert(html.includes('পরীক্ষার ব্যবহারকারী') || path.startsWith('/product'));
  }
  result = await api('/api/auth/update-user', { name: 'আপডেট করা নাম' });
  assert.equal(result.res.status, 200, JSON.stringify(result.data));
  result = await api('/api/auth/get-session');
  assert.equal(result.data.user.name, 'আপডেট করা নাম');
  result = await api('/api/auth/sign-out', {});
  assert.equal(result.res.status, 200);
  cookies = '';
  result = await api('/api/auth/get-session');
  assert.equal(result.data, null);
  console.log(
    'PASS: pages, 404s, protected redirects, signup, wrong-password rejection, login, session, protected content, profile update, logout.',
  );
} finally {
  const db = new Database(process.env.DATABASE_PATH || './data/bazar-dor.db');
  db.pragma('foreign_keys = ON');
  db.prepare('DELETE FROM user WHERE email = ?').run(email);
  db.close();
}
