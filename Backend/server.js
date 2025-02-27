// filepath: /S:/github/khana_khajana/Backend/server.js
import express from 'express';
import cors from 'cors';
import dailyMenuRoutes from './routes/dailyMenuRoutes.js';

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/daily-menus', dailyMenuRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});