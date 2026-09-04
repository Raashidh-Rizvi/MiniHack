const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

function createApp() {
  const app = express();

  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ];
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '100kb' }));
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

  const issueRoutes = require('./routes/issueRoutes');
  const authRoutes = require('./routes/authRoutes');
  const adminRoutes = require('./routes/adminRoutes');
  const officerRoutes = require('./routes/officerRoutes');

  app.use('/api/issues', issueRoutes);
  app.use('/issues', issueRoutes);

  app.use('/api/auth', authRoutes);
  app.use('/auth', authRoutes);

  app.use('/api/admin', adminRoutes);
  app.use('/admin', adminRoutes);

  app.use('/api/officer', officerRoutes);
  app.use('/officer', officerRoutes);

  app.get(['/api/categories', '/categories'], (req, res) => res.json({ success: true, data: require('./models/memoryStore').getCategories() }));
  app.get(['/api/health', '/health', '/api'], (req, res) => res.json({
    status: 'online',
    product: 'GramaFix REST API',
    version: '1.0.0',
    storage: require('./config/db').getIsConnected() ? 'mongo' : 'memory',
    timestamp: new Date().toISOString()
  }));

  app.use(require('./middleware/errorHandler'));
  return app;
}

module.exports = { createApp };
