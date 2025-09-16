import assert from 'node:assert/strict';
import { ApiError } from '../../utils/APIerror.js';

try {
  const err = new ApiError(404, 'Not found', ['missing'], '');
  assert.equal(err.statusCode, 404);
  assert.equal(err.message, 'Not found');
  assert.equal(err.success, false);
  assert.deepEqual(err.errors, ['missing']);
  console.log('✔ ApiError properties test passed');
} catch (e) {
  console.error('✘ ApiError test failed:', e.message || e);
  process.exitCode = 1;
}
