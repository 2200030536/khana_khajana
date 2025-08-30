import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./server/connect.mjs";
import cookieParser from "cookie-parser";

// Import routes
import messUserRoutes from "./routes/messUserRoutes.js";
import studentUserRoutes from "./routes/studentUserRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import studentTransactionRoutes from "./routes/studentTransactionRoutes.js";
import dailyMenuRoutes from "./routes/dailyMenuRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();
app.use(cookieParser())

// ✅ Connect MongoDB
connectDB();

// ✅ Allow only your frontend domain
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // Frontend dev server
  "http://localhost:3001", // Alternative port
  "https://khana-khajana-psi.vercel.app", // Production frontend
  "https://khana-khajana-y852.vercel.app" // Alternative frontend URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Session setup with Secure + SameSite=None (required on Vercel)
app.use(session({
  secret: "krishna",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    httpOnly: true,        // helps prevent XSS
    secure: process.env.NODE_ENV === 'production',          // ✅ Only secure in production (HTTPS)
    sameSite: "none",      // ✅ allow cross-site cookie
    maxAge: 1000 * 60 * 30 // 30 minutes
  }
}));

app.use(express.json());

// Debugging middleware for sessions
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  next();
});

// ✅ Test route
app.get("/", (req, res) => {
  res.json("Hello World!");
});

// ✅ API Routes
app.use("/messUsers", messUserRoutes);
app.use("/students", studentUserRoutes);
app.use("/admins", adminRoutes);
app.use("/transactions", studentTransactionRoutes);
app.use("/menus", dailyMenuRoutes);
app.use("/auth", authRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/daily-menus", dailyMenuRoutes);
app.use("/api/contacts", contactRoutes);

// ✅ Serve static frontend (optional, if you build React inside backend)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "../Frontend")));

// ✅ Important: Do NOT use app.listen() on Vercel
// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000; // Use port 5000 for backend
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
