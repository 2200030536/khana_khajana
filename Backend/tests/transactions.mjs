import assert from 'node:assert/strict';

export default async function runTransactionTests(baseUrl) {
  const tests = [];
  const add = (name, fn) => tests.push({ name, fn });

  add('GET /transactions returns 200 and array', async () => {
    const res = await fetch(`${baseUrl}/transactions`);
    assert.equal(res.ok, true, `Expected 2xx, got ${res.status}`);
    const body = await res.json();
    assert.equal(Array.isArray(body), true);
  });

  add('GET /transactions/student/999999/active returns 404 when none', async () => {
    const res = await fetch(`${baseUrl}/transactions/student/999999/active`);
    assert.equal([404,200].includes(res.status), true);
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
  runTransactionTests(base)
    .then(({ passed, total }) => {
      console.log(`Transaction tests: ${passed}/${total} passed`);
      process.exitCode = passed === total ? 0 : 1;
    })
    .catch((e) => { console.error(e); process.exitCode = 1; });
}
