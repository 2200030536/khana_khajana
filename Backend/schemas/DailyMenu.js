import mongoose from 'mongoose';

const dailyMenuSchema = new mongoose.Schema({

  breakfast: {
    type: String,
    required: true
  },
  lunch: {
    type: String,
    required: true
  },
  snacks: {
    type: String,
    required: true
  },
  dinner: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  }
});

const DailyMenu = mongoose.model('DailyMenu', dailyMenuSchema);

export default DailyMenu;