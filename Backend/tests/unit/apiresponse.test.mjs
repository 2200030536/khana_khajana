import assert from 'node:assert/strict';
import ApiResponse from '../../utils/APIresponse.js';

try {
  const ok = new ApiResponse(200, 'ok', { a: 1 });
  assert.equal(ok.success, true);
  assert.equal(ok.statusCode, 200);
  assert.equal(ok.message, 'ok');
  assert.deepEqual(ok.data, { a: 1 });

  const bad = new ApiResponse(400, 'bad');
  assert.equal(bad.success, false);
  assert.equal(bad.data, null);
  console.log('✔ ApiResponse unit tests passed');
} catch (e) {
  console.error('✘ ApiResponse unit tests failed:', e.message || e);
  process.exitCode = 1;
}
