import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './server/connect.mjs';
import messUserRoutes from './routes/messUserRoutes.js';
import studentUserRoutes from './routes/studentUserRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentTransactionRoutes from './routes/studentTransaction.js'; // Ensure correct import
import dailyMenuRoutes from './routes/dailyMenuRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Import the auth routes

const app = express();
const port = 3001;

// Connect to MongoDB
connectDB();

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
app.use('/auth', authRoutes); // Use the auth routes
app.use('/api/student-transactions', studentTransactionRoutes); // Ensure correct route

// Serve the HTML file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../Frontend')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});