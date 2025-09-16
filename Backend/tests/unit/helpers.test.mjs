import assert from 'node:assert/strict';
import { deriveStatusFromPayment } from '../../routes/studentTransactionRoutes.js';
import { todayKey } from '../../routes/mealVerificationRoutes.js';

// Unit: deriveStatusFromPayment
try {
  assert.equal(deriveStatusFromPayment('completed'), 'active');
  assert.equal(deriveStatusFromPayment('failed'), 'pending');
  assert.equal(deriveStatusFromPayment('refunded'), 'refunded');
  assert.equal(deriveStatusFromPayment('anything-else'), 'pending');
  console.log('✔ deriveStatusFromPayment unit tests passed');
} catch (e) {
  console.error('✘ deriveStatusFromPayment unit test failed:', e.message || e);
  process.exitCode = 1;
}

// Unit: todayKey format
try {
  const key = todayKey();
  assert.match(key, /^\d{4}-\d{2}-\d{2}$/);
  console.log('✔ todayKey format unit test passed');
} catch (e) {
  console.error('✘ todayKey unit test failed:', e.message || e);
  process.exitCode = 1;
}
