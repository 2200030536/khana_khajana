import autocannon from 'autocannon';

const base = process.env.BASE_URL || 'http://localhost:3001';

const targets = [
  { url: '/', method: 'GET' },
  { url: '/students', method: 'GET' },
  { url: '/transactions', method: 'GET' },
  { url: '/meals/verify/status/999999', method: 'GET' },
];

async function runTarget(t) {
  console.log(`\n=== Perf: ${t.method} ${t.url} ===`);
  const res = await autocannon({
    url: base + t.url,
    method: t.method,
    connections: Number(process.env.PERF_CONN || 10),
    pipelining: 1,
    duration: Number(process.env.PERF_DURATION || 10),
    headers: t.headers || {},
    body: t.body || undefined
  });
  const { latency, requests } = res;
  console.log(`Req/s avg: ${requests.average}, p95: ${requests.p95}`);
  console.log(`Latency ms avg: ${latency.average}, p95: ${latency.p95}`);
}

for (const t of targets) {
  // eslint-disable-next-line no-await-in-loop
  await runTarget(t);
}

console.log('\nPerformance run complete. Adjust PERF_CONN and PERF_DURATION as needed.');
