// Load environment variables from server/.env
import 'dotenv/config';
import * as expressModule from 'express'; // Import Express using a wildcard
import mongoose from 'mongoose';
import cors from 'cors'; 

// CRITICAL: Must use .js extension for local file imports in ESM mode
import weatherRoutes from './routes/weatherRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import authRoutes from './routes/authRoutes.js'; // 👈 NEW: Import Auth Routes

// **THE FIX:** We check for the default export (`.default`) or use the module itself
// This handles compatibility for modules originally written in CommonJS
const express = expressModule.default || expressModule;
const app = express();

const port = process.env.PORT || 5000;

// Middleware
// Allows the React client (likely on port 5173) to communicate with this server (on port 5000)
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
}));
app.use(express.json()); 

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // 👈 NEW: Register Auth Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/news', newsRoutes);

// Simple root check
app.get('/', (req, res) => {
  res.send('Dashboard API Server Running');
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});