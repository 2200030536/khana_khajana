import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import session from "express-session";
import connectDB from "./server/connect.mjs";

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

// ✅ Connect MongoDB
connectDB();

// ✅ Allow only your frontend domain
const allowedOrigins = [
  "https://khana-khajana-psi.vercel.app" // your frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Session setup with Secure + SameSite=None (required on Vercel)
app.use(session({
  secret: "krishn",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,        // helps prevent XSS
    secure: true,          // ✅ required on Vercel (HTTPS)
    sameSite: "none",      // ✅ allow cross-site cookie
    maxAge: 1000 * 60 * 30 // 30 minutes
  }
}));

app.use(express.json());

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
export default app;
