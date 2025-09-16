import express from 'express';
import StudentUser from '../schemas/StudentUser.js';
import StudentTransaction from '../schemas/StudentTransaction.js';
import DailyMenu from '../schemas/DailyMenu.js';
import DailyMeal from '../schemas/DailyMeal.js';

const router = express.Router();

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const dayNumber = String(new Date().getDay() + 1); // 1..7
    const [students, transactions, activePlans, menus, todayMenuDoc] = await Promise.all([
      StudentUser.countDocuments({}),
      StudentTransaction.countDocuments({}),
      StudentTransaction.countDocuments({ status: 'active', endDate: { $gte: now } }),
      DailyMenu.countDocuments({}),
      DailyMenu.findOne({ day: dayNumber })
    ]);

    const todayMenu = todayMenuDoc ? {
      breakfast: todayMenuDoc.breakfast ? todayMenuDoc.breakfast.split(',').map(s => s.trim()).filter(Boolean) : [],
      lunch: todayMenuDoc.lunch ? todayMenuDoc.lunch.split(',').map(s => s.trim()).filter(Boolean) : [],
      snacks: todayMenuDoc.snacks ? todayMenuDoc.snacks.split(',').map(s => s.trim()).filter(Boolean) : [],
      dinner: todayMenuDoc.dinner ? todayMenuDoc.dinner.split(',').map(s => s.trim()).filter(Boolean) : []
    } : { breakfast: [], lunch: [], snacks: [], dinner: [] };

    const date = todayKey();
    const [breakfastServed, lunchServed, snacksServed, dinnerServed, uniqueStudentsServed] = await Promise.all([
      DailyMeal.countDocuments({ date, breakfast: true }),
      DailyMeal.countDocuments({ date, lunch: true }),
      DailyMeal.countDocuments({ date, snacks: true }),
      DailyMeal.countDocuments({ date, dinner: true }),
      DailyMeal.countDocuments({ date, $or: [{ breakfast: true }, { lunch: true }, { snacks: true }, { dinner: true }] })
    ]);

    res.json({
      totals: { students, transactions, activePlans, menus },
      todayMenu,
      mealsServed: {
        breakfast: breakfastServed,
        lunch: lunchServed,
        snacks: snacksServed,
        dinner: dinnerServed,
        uniqueStudents: uniqueStudentsServed
      },
      generatedAt: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
