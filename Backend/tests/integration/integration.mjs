import assert from 'node:assert/strict';

const base = process.env.BASE_URL || 'http://localhost:3001';

function mkEmail() {
  const ts = Date.now();
  return `test.${ts}@example.com`;
}

function cookieFrom(res) {
  // undici exposes getSetCookie; fallback to get('set-cookie')
  const arr = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : null;
  if (arr && arr.length) return arr.map(c => c.split(';')[0]).join('; ');
  const one = res.headers.get('set-cookie');
  return one ? one.split(';')[0] : '';
}

export default async function runIntegration() {
  const studentId = Math.floor(100000 + Math.random() * 900000);
  const email = mkEmail();
  const password = 'p@ssw0rd!';

  // 1) Create student
  const createRes = await fetch(`${base}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', id: studentId, department: 'QA', password, email })
  });
  assert.equal(createRes.status, 201, 'Student create failed');

  // 2) Login via /auth/login
  const loginRes = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  assert.equal(loginRes.status, 200, 'Login failed');
  const cookie = cookieFrom(loginRes);
  assert.ok(cookie.includes('kk_session='), 'No session cookie');

  // 3) Get profile with cookie
  const profileRes = await fetch(`${base}/auth/profile`, { headers: { Cookie: cookie } });
  assert.equal(profileRes.status, 200, 'Profile fetch failed');
  const profile = await profileRes.json();
  assert.equal(profile.user.userType, 'studentUser');

  // 4) Create an active transaction for breakfast today
  const startDate = new Date();
  const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const txRes = await fetch(`${base}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId,
      planType: 'daily',
      breakfast: true,
      lunch: false,
      dinner: false,
      startDate,
      endDate,
      amount: 100,
      paymentStatus: 'completed',
      paymentMethod: 'cash'
    })
  });
  assert.equal(txRes.status, 201, 'Transaction create failed');

  // 5) Verify breakfast meal
  const verify1 = await fetch(`${base}/meals/verify/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, mealType: 'breakfast' })
  });
  assert.equal(verify1.ok, true, 'Meal verify should succeed');

  // 6) Duplicate verify should be blocked
  const verify2 = await fetch(`${base}/meals/verify/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, mealType: 'breakfast' })
  });
  assert.equal(verify2.status, 409, 'Duplicate meal should be blocked');

  // 7) Status reflects breakfast consumed
  const statusRes = await fetch(`${base}/meals/verify/status/${studentId}`);
  const status = await statusRes.json();
  assert.equal(status.breakfast, true, 'Breakfast should be marked consumed');

  console.log('✔ Integration flow passed');
  return { passed: 1, total: 1 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegration().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
