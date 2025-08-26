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
import contactRoutes from './routes/contactRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();
const allowedOrigins = [
  'https://khana-khajana-psi.vercel.app', // your frontend domain
];

// ✅ Enable CORS for both local and deployed frontend
app.use(cors({
  // origin: ['http://localhost:3000', 'https://khana-khajana-psi.vercel.app','https://khana-khajana-psi.vercel.app'],
  // credentials: true
   origin: allowedOrigins,
  credentials: true,
}));

// Session setup
app.use(session({
  secret: 'krishn,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30 } // 30 minutes
}));


app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.use('/messUsers', messUserRoutes);
app.use('/students', studentUserRoutes);
app.use('/admins', adminRoutes);
app.use('/transactions', studentTransactionRoutes);
app.use('/menus', dailyMenuRoutes);
app.use('/auth', authRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/daily-menus', dailyMenuRoutes);
app.use('/api/contacts', contactRoutes);

// Serve static files if needed (optional in serverless)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../Frontend')));

// ✅ Important: Do NOT use app.listen() — instead export the app
export default app;
