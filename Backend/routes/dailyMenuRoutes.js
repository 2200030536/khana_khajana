import express from 'express';
import DailyMenu from '../schemas/DailyMenu.js';

const router = express.Router();

// Create a new DailyMenu
router.post('/', async (req, res) => {
  try {
    const { breakfast, lunch, snacks, dinner, day, lastModifiedBy, lastModifiedAt } = req.body;
    const newMenu = new DailyMenu({ 
      breakfast, 
      lunch, 
      snacks, 
      dinner, 
      day,
      lastModifiedBy,
      lastModifiedAt 
    });
    
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    console.error('Error saving menu:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get all DailyMenus
router.get('/', async (req, res) => {
  try {
    const menus = await DailyMenu.find();
    res.status(200).json(menus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a DailyMenu by day
router.get('/day/:day', async (req, res) => {
  try {
    const menu = await DailyMenu.findOne({ day: req.params.day });
    if (!menu) {
      return res.status(404).json({ error: 'DailyMenu not found for the specified day' });
    }
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a DailyMenu by day
router.put('/day/:day', async (req, res) => {
  try {
    const { breakfast, lunch, snacks, dinner, lastModifiedBy, lastModifiedAt } = req.body;
    const updatedMenu = await DailyMenu.findOneAndUpdate(
      { day: req.params.day },
      { breakfast, lunch, snacks, dinner, lastModifiedBy, lastModifiedAt },
      { new: true, runValidators: true }
    );
    if (!updatedMenu) {
      return res.status(404).json({ error: 'DailyMenu not found for the specified day' });
    }
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a DailyMenu by day
router.delete('/day/:day', async (req, res) => {
  try {
    const deletedMenu = await DailyMenu.findOneAndDelete({ day: req.params.day });
    if (!deletedMenu) {
      return res.status(404).json({ error: 'DailyMenu not found for the specified day' });
    }
    res.status(200).json({ message: 'DailyMenu deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;