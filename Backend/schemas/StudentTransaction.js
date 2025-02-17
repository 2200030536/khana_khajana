import mongoose from 'mongoose';

const studentTransactionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.Number,
    ref: 'StudentUser',
    required: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  breakfast: {
    type: Boolean,
    required: true
  },
  lunch: {
    type: Boolean,
    required: true
  },
  dinner: {
    type: Boolean,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  uniqueToken: {
    type: String,
    required: true,
    unique: true
  }
});

const StudentTransaction = mongoose.model('StudentTransaction', studentTransactionSchema);

export default StudentTransaction;