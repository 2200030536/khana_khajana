import express from 'express';
import MessUser from '../schemas/MessUser.js';
import { authenticateToken, generateToken } from '../utils/jwtUtils.js';
import { hashPassword } from '../utils/passwordUtils.js';

const router = express.Router();

// Create a new MessUser with JWT
router.post('/signup', async (req, res) => {
  try {
    const { name, id, password, email } = req.body;
    
    // Check if user already exists
    const existingUser = await MessUser.findOne({ 
      $or: [{ email }, { id }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or ID already exists' 
      });
    }
    
    // For now, using plain text password (should implement hashing later)
    const newMessUser = new MessUser({ name, id, password, email });
    await newMessUser.save();
    
    // Generate JWT token for automatic login
    const token = generateToken({
      id: newMessUser._id,
      email: newMessUser.email,
      userType: 'messUser'
    });
    
    // Return success with token and user info
    res.status(201).json({
      message: 'Mess user registration successful',
      token: token,
      user: {
        id: newMessUser._id,
        email: newMessUser.email,
        name: newMessUser.name,
        userType: 'messUser'
      }
    });
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
  

// Get all MessUsers (Protected)
router.get('/', authenticateToken, async (req, res) => {
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