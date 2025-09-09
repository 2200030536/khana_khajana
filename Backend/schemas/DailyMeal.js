import mongoose from 'mongoose';

const dailyMealSchema = new mongoose.Schema({
  studentId: { type: Number, required: true, index: true }, // numeric student id
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  breakfast: { type: Boolean, default: false },
  lunch: { type: Boolean, default: false },
  snacks: { type: Boolean, default: false },
  dinner: { type: Boolean, default: false },
}, { timestamps: true });

dailyMealSchema.index({ studentId: 1, date: 1 }, { unique: true });

const DailyMeal = mongoose.model('DailyMeal', dailyMealSchema);
export default DailyMeal;