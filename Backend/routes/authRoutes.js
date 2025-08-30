import express from 'express';
import MessUser from '../schemas/MessUser.js';
import StudentUser from '../schemas/StudentUser.js';
import Admin from '../schemas/Admin.js';
import { generateToken, authenticateToken } from '../utils/jwtUtils.js';
import { comparePassword } from '../utils/passwordUtils.js';

const router = express.Router();

// Login route for all user types
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let user = null;
    let userType = null;

    // Check in StudentUser table
    user = await StudentUser.findOne({ email });
    if (user && user.password === password) { // For now, using plain text comparison
      userType = 'studentUser';
    } else {
      // Check in MessUser table
      user = await MessUser.findOne({ email });
      if (user && user.password === password) {
        userType = 'messUser';
      } else {
        // Check in Admin table
        user = await Admin.findOne({ email });
        if (user && user.password === password) {
          userType = 'admin';
        } else {
          user = null; // Reset if no match found
        }
      }
    }

    // If no user is found in any table
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      userType: userType
    });

    // Return token and user details
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        email: user.email,
        userType: userType,
        name: user.name || user.username
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Profile route
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { id, userType } = req.user;
    let user;

    if (userType === 'messUser') {
      user = await MessUser.findById(id);
    } else if (userType === 'studentUser') {
      user = await StudentUser.findById(id);
    } else if (userType === 'admin') {
      user = await Admin.findById(id);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Include userType in the response
    res.status(200).json({ user: { ...user.toObject(), userType } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // With JWT, logout is handled on the client-side by removing the token
  // No server-side session to destroy
  res.status(200).json({ 
    message: 'Logout successful. Please remove the token from client storage.' 
  });
});

export default router;