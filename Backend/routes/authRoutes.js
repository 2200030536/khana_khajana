import express from 'express';
import session from 'express-session';
import MessUser from '../schemas/MessUser.js';
import StudentUser from '../schemas/StudentUser.js';
import Admin from '../schemas/Admin.js';

const router = express.Router();

// Configure session middleware
router.use(session({
  secret: 'krishna', // Replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
};

// Login route for all user types
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = null;
    let userType = null;

    // Check in StudentUser table
    user = await StudentUser.findOne({ email, password });
    if (user) {
      userType = 'studentUser';
    } else {
      // Check in MessUser table
      user = await MessUser.findOne({ email, password });
      if (user) {
        userType = 'messUser';
      } else {
        // Check in Admin table
        user = await Admin.findOne({ email, password });
        if (user) {
          userType = 'admin';
        }
      }
    }

    // If no user is found in any table
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Save user information in session
    req.session.user = {
      id: user._id,
      email: user.email,
      userType: userType
    };

    // Return user details along with userType
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        userType: userType
      }
    }).cookie("accessToken", "ok", options);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Profile route
router.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id, userType } = req.session.user;
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
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

export default router;
