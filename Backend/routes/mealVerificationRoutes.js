import express from 'express';
import StudentTransaction from '../schemas/StudentTransaction.js';
import DailyMeal from '../schemas/DailyMeal.js';

const router = express.Router();

// Helper: get today in YYYY-MM-DD
function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0,10);
}

// POST /verify
// body: { studentId (number) OR token (string), mealType: 'breakfast'|'lunch'|'snacks'|'dinner' }
router.post('/verify', async (req, res) => {
  try {
    const { studentId, token, mealType } = req.body;
    if (!mealType || !['breakfast','lunch','snacks','dinner'].includes(mealType)) {
      return res.status(400).json({ error: 'Invalid mealType' });
    }

    if (!studentId && !token) {
      return res.status(400).json({ error: 'Provide studentId or token' });
    }

    // Find latest active transaction either by numeric studentId or token
    let query = { status: 'active' };
    if (token) query.uniqueToken = token;
    if (studentId) query.studentId = studentId;

    const tx = await StudentTransaction.findOne(query).sort({ createdAt: -1 });
    if (!tx) {
      return res.status(404).json({ error: 'Active transaction not found' });
    }

    const now = new Date();
    if (new Date(tx.startDate) > now || new Date(tx.endDate) < now) {
      return res.status(400).json({ error: 'Plan not valid for current date' });
    }

    if (!tx[mealType]) {
      return res.status(400).json({ error: `Meal ${mealType} not included in plan` });
    }

    const dateKey = todayKey();
    let daily = await DailyMeal.findOne({ studentId: tx.studentId, date: dateKey });
    if (!daily) {
      daily = new DailyMeal({ studentId: tx.studentId, date: dateKey });
    }

    if (daily[mealType]) {
      return res.status(409).json({ error: 'Meal already consumed today', daily });
    }

    daily[mealType] = true;
    await daily.save();

    res.json({ message: 'Meal verified, provide meal now', transactionId: tx.transactionId, studentId: tx.studentId, mealType, daily });
  } catch (e) {
    console.error('Verification error:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET /status/:studentId -> returns today status
router.get('/status/:studentId', async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    if (!studentId) return res.status(400).json({ error: 'Invalid studentId' });
    const daily = await DailyMeal.findOne({ studentId, date: todayKey() });
    res.json(daily || { studentId, date: todayKey(), breakfast:false,lunch:false,snacks:false,dinner:false });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;