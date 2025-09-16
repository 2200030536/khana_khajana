import runSmoke from './smoke.mjs';
import runAuth from './auth.mjs';
import runStudents from './students.mjs';
import runTransactions from './transactions.mjs';
import runMeals from './meals.mjs';

const base = process.env.BASE_URL || 'http://localhost:3001';

const suites = [
  ['Smoke', runSmoke],
  ['Auth', runAuth],
  ['Students', runStudents],
  ['Transactions', runTransactions],
  ['Meals', runMeals],
];

let totalPassed = 0;
let totalTests = 0;

for (const [name, fn] of suites) {
  try {
    console.log(`\n=== ${name} ===`);
    const { passed, total } = await fn(base);
    totalPassed += passed;
    totalTests += total;
  } catch (e) {
    console.error(`${name} suite error:`, e?.message || e);
  }
}

console.log(`\nSummary: ${totalPassed}/${totalTests} tests passed`);
process.exitCode = totalPassed === totalTests ? 0 : 1;
