const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '100kb' }));
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
  app.use('/api/issues', require('./routes/issueRoutes'));
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
  app.use('/api/officer', require('./routes/officerRoutes'));
  app.get('/api/categories', (req, res) => res.json({ success: true, data: require('./models/memoryStore').getCategories() }));
  app.get('/api/health', (req, res) => res.json({ status: 'online', product: 'GramaFix REST API', storage: require('./config/db').getIsConnected() ? 'mongo' : 'memory' }));
  app.use(require('./middleware/errorHandler'));
  return app;
}
module.exports = { createApp };
