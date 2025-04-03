import express from 'express';
import Price from '../schemas/Price.js';

const router = express.Router();

// Get current active price configuration
router.get('/current', async (req, res) => {
  try {
    // Find the active price configuration
    let currentPrice = await Price.findOne({ isActive: true });
    
    // If no active price found, get the most recent one
    if (!currentPrice) {
      currentPrice = await Price.findOne().sort({ effectiveFrom: -1 });
    }
    
    if (!currentPrice) {
      return res.status(404).json({ message: 'No price configuration found' });
    }
    
    res.json(currentPrice);
  } catch (error) {
    console.error('Error fetching current price:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prices applicable for a specific date
router.get('/for-date/:date', async (req, res) => {
  try {
    const targetDate = new Date(req.params.date);
    
    if (isNaN(targetDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Find price configuration that was effective before or on the target date
    const applicablePrice = await Price.findOne({
      effectiveFrom: { $lte: targetDate }
    }).sort({ effectiveFrom: -1 });
    
    if (!applicablePrice) {
      return res.status(404).json({ message: 'No price configuration found for the specified date' });
    }
    
    res.json(applicablePrice);
  } catch (error) {
    console.error('Error fetching price for date:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all price configurations (history)
router.get('/', async (req, res) => {
  try {
    const prices = await Price.find().sort({ effectiveFrom: -1 });
    res.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new price configuration
router.post('/', async (req, res) => {
  try {
    const { 
      breakfast, 
      lunch, 
      snacks, 
      dinner, 
      plans,
      effectiveFrom,
      isActive,
      notes,
      lastModifiedBy = 1 // Default value since we don't have auth
    } = req.body;
    
    // Validation
    if (!breakfast || !lunch || !snacks || !dinner || !plans) {
      return res.status(400).json({ message: 'All price fields are required' });
    }
    
    // Create new price configuration
    const newPrice = new Price({
      breakfast,
      lunch,
      snacks,
      dinner,
      plans,
      effectiveFrom: effectiveFrom || Date.now(),
      isActive: isActive !== undefined ? isActive : true,
      lastModifiedBy, // Use the provided value or default
      notes
    });
    
    await newPrice.save();
    
    res.status(201).json(newPrice);
  } catch (error) {
    console.error('Error creating price configuration:', error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Check for duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Another price configuration is already active. Please deactivate it first.'
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Update price configuration
router.put('/:id', async (req, res) => {
  try {
    const priceId = req.params.id;
    const updates = req.body;
    
    // Use lastModifiedBy from the request or set a default
    if (!updates.lastModifiedBy) {
      updates.lastModifiedBy = 1; // Default value
    }
    
    const updatedPrice = await Price.findByIdAndUpdate(
      priceId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!updatedPrice) {
      return res.status(404).json({ message: 'Price configuration not found' });
    }
    
    res.json(updatedPrice);
  } catch (error) {
    console.error('Error updating price configuration:', error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Check for duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Another price configuration is already active. Please deactivate it first.'
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a price configuration
router.delete('/:id', async (req, res) => {
  try {
    const deletedPrice = await Price.findByIdAndDelete(req.params.id);
    
    if (!deletedPrice) {
      return res.status(404).json({ message: 'Price configuration not found' });
    }
    
    res.json({ message: 'Price configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting price configuration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;