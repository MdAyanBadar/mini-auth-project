import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import ticketsRoutes from './routes/tickets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/tickets', ticketsRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mini Auth API is running',
    endpoints: [
      'POST /auth/register',
      'POST /auth/login',
      'POST /auth/google',
      'GET /tickets (protected)',
      'POST /tickets (protected)',
      'POST /tickets/:id/resolve (protected)'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
