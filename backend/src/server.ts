import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import moduleRoutes from './routes/module.routes';
import quizRoutes from './routes/quiz.routes';
import syncRoutes from './routes/sync.routes';
import supervisorRoutes from './routes/supervisor.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Blue-Collar LMS Backend API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/modules', moduleRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/sync', syncRoutes);
app.use('/api/v1/supervisor', supervisorRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Blue-Collar LMS Backend running at http://localhost:${PORT}`);
  });
}

export default app;

