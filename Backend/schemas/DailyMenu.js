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
    required: true,
    unique: true
  },
  lastModifiedBy: {
    type: String,
    required: true
  },
  lastModifiedAt: {
    type: String,
    required: true
  }
}, { 
  timestamps: true // This adds createdAt and updatedAt fields
});

const DailyMenu = mongoose.model('DailyMenu', dailyMenuSchema);

export default DailyMenu;