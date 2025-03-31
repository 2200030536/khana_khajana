import express from 'express';
import StudentTransaction from '../schemas/StudentTransaction.js';

const router = express.Router();

// Create a new StudentTransaction
router.post('/', async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { studentId, breakfast, lunch, dinner, startDate, endDate } = req.body;
    const newTransaction = new StudentTransaction({ studentId, breakfast, lunch, dinner, startDate, endDate });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get all StudentTransactions
router.get('/', async (req, res) => {
  try {
    const transactions = await StudentTransaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get StudentTransaction by studentId
router.get('/student/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const transaction = await StudentTransaction.findOne({ studentId });

    if (!transaction) {
      return res.status(404).json({ error: 'StudentTransaction not found for the given studentId' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching StudentTransaction:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Update an existing StudentTransaction
router.put('/:id', async (req, res) => {
  try {
    const { studentId, breakfast, lunch, dinner, startDate, endDate, uniqueToken } = req.body;
    const updatedTransaction = await StudentTransaction.findOneAndUpdate(
      { transactionId: req.params.id },
      { studentId, breakfast, lunch, dinner, startDate, endDate, uniqueToken },
      { new: true, runValidators: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ error: 'StudentTransaction not found' });
    }
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an existing StudentTransaction
router.delete('/:id', async (req, res) => {
  try {
    const deletedTransaction = await StudentTransaction.findOneAndDelete({ transactionId: req.params.id });
    if (!deletedTransaction) {
      return res.status(404).json({ error: 'StudentTransaction not found' });
    }
    res.status(200).json({ message: 'StudentTransaction deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;