import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import session from 'express-session';
import connectDB from './server/connect.mjs';
import messUserRoutes from './routes/messUserRoutes.js';
import studentUserRoutes from './routes/studentUserRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentTransactionRoutes from './routes/studentTransactionRoutes.js';
import dailyMenuRoutes from './routes/dailyMenuRoutes.js';
import authRoutes from './routes/authRoutes.js';
import priceRoutes from './routes/priceRoutes.js';
import contactRoutes from './routes/contactRoutes.js'; // Add this line



const app = express();
const port = 3001;

// Connect to MongoDB
connectDB();

// Enable CORS for both localhost and production
app.use(cors({
  origin: [
    'http://localhost:3000', // Frontend development server
    'https://khana-khajana-psi.vercel.app' // Production frontend
  ],
  credentials: true // Allow credentials (cookies) to be sent
}));

// Configure session middleware
app.use(session({
  secret: 'krishna', // Replace with your own secret key
  resave: false,
  saveUninitialized: false, // Changed to false for security
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Only secure in production (HTTPS)
    httpOnly: true, // Prevent XSS attacks
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-site in dev
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Debug middleware for sessions
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('Cookies:', req.headers.cookie);
  next();
});

// Sample route
app.get('/', (req, res) => {
  res.json('Hello World!');
});

// Use routes
app.use('/messUsers', messUserRoutes);
app.use('/students', studentUserRoutes);
app.use('/admins', adminRoutes);
app.use('/transactions', studentTransactionRoutes);
app.use('/menus', dailyMenuRoutes);
app.use('/auth', authRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/daily-menus', dailyMenuRoutes);
app.use('/api/contacts', contactRoutes); // Add this line

// Serve the HTML file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../Frontend')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});