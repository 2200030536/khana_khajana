import express from 'express';
import MessUser from '../schemas/MessUser.js';
import StudentUser from '../schemas/StudentUser.js';
import Admin from '../schemas/Admin.js';

const router = express.Router();

// Login route for all user types
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    let user;
    if (userType === 'messUser') {
      user = await MessUser.findOne({ email, password });
    } else if (userType === 'studentUser') {
      user = await StudentUser.findOne({ email, password });
    } else if (userType === 'admin') {
      user = await Admin.findOne({ email, password });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;