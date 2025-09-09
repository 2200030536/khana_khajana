import express from 'express';
import StudentTransaction from '../schemas/StudentTransaction.js';

const router = express.Router();

// Helper to mark past-due transactions as expired
async function expirePastTransactions(studentId) {
  const now = new Date();
  const query = {
    endDate: { $lt: now },
    status: { $in: ['active', 'pending'] }
  };
  if (studentId) {
    query.studentId = studentId;
  }
  try {
    const result = await StudentTransaction.updateMany(query, { $set: { status: 'expired' } });
    if (result.modifiedCount > 0) {
      console.log(`Expired ${result.modifiedCount} transaction(s)${studentId ? ' for student ' + studentId : ''}.`);
    }
  } catch (e) {
    console.warn('Failed to auto-expire transactions:', e.message);
  }
}

// Create a new StudentTransaction
router.post('/', async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    
    // Extract all fields from request body
    const { 
      studentId, 
      planType, 
      breakfast, 
      lunch, 
      dinner, 
      startDate, 
      endDate,
      amount,
      paymentStatus,
      paymentMethod,
      status
    } = req.body;
    
    // Create new transaction with all required fields explicitly
    // Derive internal status: if paymentStatus pending -> pending, if completed -> active, if failed -> pending (or could be failed), refunded -> refunded
    let derivedStatus = 'pending';
    if (paymentStatus === 'completed') derivedStatus = 'active';
    else if (paymentStatus === 'failed') derivedStatus = 'pending';
    else if (paymentStatus === 'refunded') derivedStatus = 'refunded';

    const newTransaction = new StudentTransaction({
      studentId,
      planType,
      breakfast,
      lunch,
      dinner,
      startDate,
      endDate,
      amount,
      paymentStatus,
      paymentMethod,
      status: derivedStatus
    });
    
    // Save with validation
    await newTransaction.save();
    
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error.message);
    
    // Provide more detailed error information
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(field => ({
        field,
        message: error.errors[field].message
      }));
      
      res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Add new route for extending an existing plan
router.post('/extend', async (req, res) => {
  try {
    console.log('Extension Request Body:', req.body);
    
    // Extract required fields for extension
    const { 
      studentId, 
      planType, 
      breakfast, 
      lunch, 
      dinner, 
      currentEndDate,
      newEndDate,
      amount,
      paymentStatus,
      paymentMethod
    } = req.body;
    
    // Find the most recent active transaction for this student
    const currentTransaction = await StudentTransaction.findOne({ 
      studentId, 
      status: 'active',
      endDate: currentEndDate
    });
    
    if (!currentTransaction) {
      return res.status(404).json({ 
        error: 'No active plan found for extension with the specified end date' 
      });
    }
    
    // Create a new transaction record for the extension
    const extensionTransaction = new StudentTransaction({
      studentId,
      planType,
      breakfast: breakfast !== undefined ? breakfast : currentTransaction.breakfast,
      lunch: lunch !== undefined ? lunch : currentTransaction.lunch,
      dinner: dinner !== undefined ? dinner : currentTransaction.dinner,
      startDate: new Date(currentEndDate), // Start from the end of current plan
      endDate: newEndDate,
      amount,
      paymentStatus,
      paymentMethod,
      status: paymentStatus === 'completed' ? 'active' : 'pending',
      isExtension: true, // Mark as an extension transaction
      previousTransactionId: currentTransaction._id // Reference to original plan
    });
    
    // Save the extension
    await extensionTransaction.save();
    
    res.status(201).json(extensionTransaction);
  } catch (error) {
    console.error('Error creating plan extension:', error.message);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(field => ({
        field,
        message: error.errors[field].message
      }));
      
      res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Get all StudentTransactions
router.get('/', async (req, res) => {
  try {
  await expirePastTransactions();
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
  await expirePastTransactions(studentId);

    const transaction = await StudentTransaction
      .findOne({ studentId })
      .sort({ createdAt: -1 }); // Sort by createdAt descending (latest first)

    if (!transaction) {
      return res.status(404).json({ error: 'StudentTransaction not found for the given studentId' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching StudentTransaction:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get full transaction history for a student (all transactions, newest first)
router.get('/student/:studentId/history', async (req, res) => {
  try {
    const { studentId } = req.params;
  await expirePastTransactions(studentId);
    const transactions = await StudentTransaction.find({ studentId }).sort({ createdAt: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching StudentTransaction history:', error.message);
    res.status(400).json({ error: error.message });
  }
});


// Get all active transactions for a student
router.get('/student/:studentId/active', async (req, res) => {
  try {
    const studentId = req.params.studentId;
  await expirePastTransactions(studentId);
    const activeTransaction = await StudentTransaction.findOne({ 
      studentId, 
      status: 'active',
      endDate: { $gte: new Date() } // Only return plans that haven't expired yet
    }).sort({ endDate: -1 }); // Get the one with the latest end date

    if (!activeTransaction) {
      return res.status(404).json({ error: 'No active plan found for this student' });
    }

    res.status(200).json(activeTransaction);
  } catch (error) {
    console.error('Error fetching active StudentTransaction:', error.message);
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