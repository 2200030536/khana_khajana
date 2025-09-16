import assert from 'node:assert/strict';

export default async function runAuthTests(baseUrl) {
  const tests = [];
  const add = (name, fn) => tests.push({ name, fn });

  add('GET /auth/profile should be 401 when not logged in', async () => {
    const res = await fetch(`${baseUrl}/auth/profile`);
    assert.equal(res.status, 401);
  });

  add('POST /auth/logout should return 200 even if not logged', async () => {
    const res = await fetch(`${baseUrl}/auth/logout`, { method: 'POST' });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(typeof body.message, 'string');
  });

  let passed = 0;
  for (const t of tests) {
    try {
      await t.fn();
      passed += 1;
      console.log(`✔ ${t.name}`);
    } catch (err) {
      console.error(`✘ ${t.name}:`, err.message || err);
    }
  }
  return { passed, total: tests.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const base = process.env.BASE_URL || 'http://localhost:3001';
  runAuthTests(base)
    .then(({ passed, total }) => {
      console.log(`Auth tests: ${passed}/${total} passed`);
      process.exitCode = passed === total ? 0 : 1;
    })
    .catch((e) => { console.error(e); process.exitCode = 1; });
}
