import assert from 'node:assert/strict';

export default async function runStudentTests(baseUrl) {
  const tests = [];
  const add = (name, fn) => tests.push({ name, fn });

  add('GET /students should return 200 and array', async () => {
    const res = await fetch(`${baseUrl}/students`);
    assert.equal(res.ok, true, `Expected 2xx, got ${res.status}`);
    const body = await res.json();
    assert.equal(Array.isArray(body), true);
  });

  add('POST /students with missing body should 400', async () => {
    const res = await fetch(`${baseUrl}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.equal(res.status, 400);
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
  runStudentTests(base)
    .then(({ passed, total }) => {
      console.log(`Student tests: ${passed}/${total} passed`);
      process.exitCode = passed === total ? 0 : 1;
    })
    .catch((e) => { console.error(e); process.exitCode = 1; });
}
