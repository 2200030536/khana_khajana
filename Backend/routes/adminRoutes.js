import express from 'express';
import Admin from '../schemas/Admin.js';

const router = express.Router();

// Create a new Admin
router.post('/signup', async (req, res) => {
  try {
    const { name, id, password, email } = req.body;
    const newAdmin = new Admin({ name, id, password, email });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new Admin
router.post('/', async (req, res) => {
    try {
      const { name, id, password, email } = req.body;
      const newAdmin = new Admin({ name, id, password, email });
      await newAdmin.save();
      res.status(201).json(newAdmin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
// Get all Admins
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an existing Admin
router.put('/:id', async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const updatedAdmin = await Admin.findOneAndUpdate(
      { id: req.params.id },
      { name, password, email },
      { new: true, runValidators: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an existing Admin
router.delete('/:id', async (req, res) => {
  try {
    const deletedAdmin = await Admin.findOneAndDelete({ id: req.params.id });
    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;