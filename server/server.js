import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import activityRoutes from './routes/activityRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { apiResponse } from './middleware/apiResponse.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(apiResponse);

app.get('/', (req, res) => {
  res.json({ message: 'Prodesk Mission 17 API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/users', userRoutes);
app.use('/api', supportRoutes);
app.use('/api', stripeRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id', errors: [{ field: err.path, message: err.message }] });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value', errors: Object.keys(err.keyValue || {}).map((field) => ({ field, message: `${field} already exists` })) });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors || {}).map((error) => ({ field: error.path, message: error.message }))
    });
  }

  res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal Server Error' : err.message
  });
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    process.stdout.write(`Server running on port ${PORT}\n`);
  }
});

process.on('unhandledRejection', (error) => {
  process.stderr.write(`Unhandled rejection: ${error.message}\n`);
  process.exit(1);
});
