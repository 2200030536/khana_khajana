import express from 'express';
import MessUser from '../schemas/MessUser.js';

const router = express.Router();

// Create a new MessUser
router.post('/signup', async (req, res) => {
  try {
    const { name, id, password, email } = req.body;
    const newMessUser = new MessUser({ name, id, password, email });
    await newMessUser.save();
    res.status(201).json(newMessUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new MessUser
router.post('/', async (req, res) => {
    try {
      const { name, id, password, email } = req.body;
      const newMessUser = new MessUser({ name, id, password, email });
      await newMessUser.save();
      res.status(201).json(newMessUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

// Get all MessUsers
router.get('/', async (req, res) => {
  try {
    const messUsers = await MessUser.find();
    res.status(200).json(messUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login MessUser
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await MessUser.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an existing MessUser
router.put('/:id', async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const updatedMessUser = await MessUser.findOneAndUpdate(
      { id: req.params.id },
      { name, password, email },
      { new: true, runValidators: true }
    );
    if (!updatedMessUser) {
      return res.status(404).json({ error: 'MessUser not found' });
    }
    res.status(200).json(updatedMessUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an existing MessUser
router.delete('/:id', async (req, res) => {
  try {
    const deletedMessUser = await MessUser.findOneAndDelete({ id: req.params.id });
    if (!deletedMessUser) {
      return res.status(404).json({ error: 'MessUser not found' });
    }
    res.status(200).json({ message: 'MessUser deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;