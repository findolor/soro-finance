import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './api/middlewares/error.middleware';
import logger from './utils/logger';
import { startTestCron } from './jobs/testCron';

const app = express();

// Initialize cron jobs
startTestCron();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info({
    type: 'request',
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes will be added here
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/projects', projectRoutes);
// app.use('/api/v1/expenses', expenseRoutes);
// app.use('/api/v1/payments', paymentRoutes);

// Error handling
app.use(errorHandler);

export default app; 