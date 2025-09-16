import assert from 'node:assert/strict';

export default async function runMealTests(baseUrl) {
  const tests = [];
  const add = (name, fn) => tests.push({ name, fn });

  add('POST /meals/verify/verify requires mealType', async () => {
    const res = await fetch(`${baseUrl}/meals/verify/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.equal(res.status, 400);
  });

  add('GET /meals/verify/status/:studentId returns default when none', async () => {
    const res = await fetch(`${baseUrl}/meals/verify/status/999999`);
    assert.equal(res.ok, true);
    const body = await res.json();
    assert.equal(body.studentId, 999999);
    assert.equal(typeof body.breakfast, 'boolean');
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
  runMealTests(base)
    .then(({ passed, total }) => {
      console.log(`Meal tests: ${passed}/${total} passed`);
      process.exitCode = passed === total ? 0 : 1;
    })
    .catch((e) => { console.error(e); process.exitCode = 1; });
}
