// Minimal API smoke tests that can run on startup or via `npm run test:smoke`
import assert from 'node:assert/strict';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function runSmokeTests(baseUrl) {
  const tests = [];

  const add = (name, fn) => tests.push({ name, fn });

  // Basic health check
  add('GET / should return Hello World!', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.ok, true, `Expected 2xx, got ${res.status}`);
    const data = await res.json();
    assert.equal(data, 'Hello World!');
  });

  // CORS preflight sanity
  add('OPTIONS preflight responds 204', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
      }
    });
    assert.equal(res.status, 204);
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
    // slight delay between tests
    await wait(50);
  }

  return { passed, total: tests.length };
}

// Allow running standalone via `node tests/smoke.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  const base = process.env.BASE_URL || 'http://localhost:3001';
  runSmokeTests(base)
    .then(({ passed, total }) => {
      console.log(`API smoke tests: ${passed}/${total} passed`);
      process.exitCode = passed === total ? 0 : 1;
    })
    .catch((e) => {
      console.error('Smoke test execution error:', e);
      process.exitCode = 1;
    });
}
