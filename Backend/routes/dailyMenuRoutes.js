import express from 'express';
import DailyMenu from '../schemas/DailyMenu.js';

const router = express.Router();

// Create a new DailyMenu
router.post('/', async (req, res) => {
  try {
    const { id, breakfast, lunch, snacks, dinner, day } = req.body;
    const newMenu = new DailyMenu({ id, breakfast, lunch, snacks, dinner, day });
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
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

// Update an existing DailyMenu
router.put('/:id', async (req, res) => {
  try {
    const { breakfast, lunch, snacks, dinner, day } = req.body;
    const updatedMenu = await DailyMenu.findOneAndUpdate(
      { id: req.params.id },
      { breakfast, lunch, snacks, dinner, day },
      { new: true, runValidators: true }
    );
    if (!updatedMenu) {
      return res.status(404).json({ error: 'DailyMenu not found' });
    }
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an existing DailyMenu
router.delete('/:id', async (req, res) => {
  try {
    const deletedMenu = await DailyMenu.findOneAndDelete({ id: req.params.id });
    if (!deletedMenu) {
      return res.status(404).json({ error: 'DailyMenu not found' });
    }
    res.status(200).json({ message: 'DailyMenu deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;