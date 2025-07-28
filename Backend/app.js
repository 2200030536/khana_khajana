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

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://khana-khajana-psi.vercel.app'],
  credentials: true
}));

// Configure session middleware
app.use(session({
  secret: 'krishna', // Replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to parse JSON bodies
app.use(express.json());

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
