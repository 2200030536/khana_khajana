import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
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
// Trust proxy so secure cookies work behind Vercel/Render reverse proxy
app.set('trust proxy', 1);
const port = 3001;

// Connect to MongoDB
connectDB();

// Enable CORS for both localhost and production
const allowedOrigins = [
  'http://localhost:3000',
  'https://khana-khajana-psi.vercel.app',
  'https://khana-khajana-y852.vercel.app'
];

// Robust production detection (Render / Vercel) even if NODE_ENV left as 'development'
const isPlatformProd = (
  process.env.NODE_ENV === 'production' ||
  process.env.VERCEL === '1' ||
  !!process.env.RENDER ||
  process.env.PLATFORM === 'production'
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'krishna',
  resave: false,
  saveUninitialized: false,
  name: 'kk_session',
  store: isPlatformProd ? MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    touchAfter: 24 * 3600,
    crypto: { secret: process.env.SESSION_SECRET || 'krishna' }
  }) : undefined,
  cookie: {
    secure: isPlatformProd,               // must be true for SameSite=None
    httpOnly: true,
    sameSite: isPlatformProd ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    // Do NOT set domain; let browser infer so it works on Render subdomain
    // path defaults to '/'
  }
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Debug middleware for sessions
// app.use((req, res, next) => {
//   console.log('Session ID:', req.sessionID,
//     '| hasUser:', !!req.session.user,
//     '| secure?', req.session.cookie.secure,
//     '| sameSite:', req.session.cookie.sameSite,
//     '| origin:', req.headers.origin);
//   if (!req.headers.cookie) {
//     console.log('-> No Cookie header received. If this is a cross-site XHR from production, check:');
//     console.log('   1) Frontend request includes withCredentials: true');
//     console.log('   2) Set-Cookie has SameSite=None; Secure');
//     console.log('   3) Browser devtools: Was Set-Cookie blocked? (3rd-party, insecure, or partitioned)');
//     console.log('   4) NODE_ENV or platform flags causing wrong sameSite/secure logic');
//   }
//   next();
// });

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