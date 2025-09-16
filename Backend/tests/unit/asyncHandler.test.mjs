import assert from 'node:assert/strict';
import asyncHandler from '../../utils/asyncHandler.js';

// Mock req/res/next
function createMocks() {
  const res = {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; }
  };
  const req = {};
  const next = () => {};
  return { req, res, next };
}

// Test: happy path
try {
  const { req, res, next } = createMocks();
  let ran = false;
  const handler = asyncHandler(async () => { ran = true; });
  await handler(req, res, next);
  assert.equal(ran, true);
  assert.equal(res.statusCode, null); // should not set status
  console.log('✔ asyncHandler success path test passed');
} catch (e) {
  console.error('✘ asyncHandler success path failed:', e.message || e);
  process.exitCode = 1;
}

// Test: error path sets status and message
try {
  const { req, res, next } = createMocks();
  const handler = asyncHandler(async () => { const err = new Error('boom'); err.statusCode = 418; throw err; });
  await handler(req, res, next);
  assert.equal(res.statusCode, 418);
  assert.equal(res.body.success, false);
  assert.equal(res.body.message, 'boom');
  console.log('✔ asyncHandler error path test passed');
} catch (e) {
  console.error('✘ asyncHandler error path failed:', e.message || e);
  process.exitCode = 1;
}
