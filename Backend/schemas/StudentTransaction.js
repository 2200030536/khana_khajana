import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
  planType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'semester'], // Added 'semester' to the enum
    required: true
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
  amount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'card', 'upi'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'canceled'],
    default: 'active',
    required: true
  },
  refundDetails: {
    refundedAt: Date,
    refundAmount: Number,
    reason: String
  },
  notes: {
    type: String
  },
  uniqueToken: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4
  }
}, { timestamps: true });  // Adds createdAt and updatedAt automatically

const StudentTransaction = mongoose.model('StudentTransaction', studentTransactionSchema);

export default StudentTransaction;