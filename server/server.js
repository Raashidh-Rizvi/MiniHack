const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config(); // Fallback to root .env
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const issueRoutes = require('./routes/issueRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const officerRoutes = require('./routes/officerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with graceful fallback
connectDB();

// CORS Configuration
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
        callback(null, true); // Allow during hackathon dev
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/issues', issueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/officer', officerRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'GramaFix REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Central Error Handler
app.use(errorHandler);

// Start server with retry logic for EADDRINUSE race condition
let server;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1500;

function startServer(attempt = 1) {
  server = app.listen(PORT, () => {
    console.log(`🚀 GramaFix Server listening on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📝 Citizen Intake API: http://localhost:${PORT}/api/issues`);
    console.log(`🔐 Admin Priority Engine API: http://localhost:${PORT}/api/admin/queue`);
    console.log(`👷 Officer Portal API: http://localhost:${PORT}/api/officer/queue`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Port ${PORT} busy. Retrying in ${RETRY_DELAY_MS}ms... (attempt ${attempt}/${MAX_RETRIES})`);
        server.close();
        setTimeout(() => startServer(attempt + 1), RETRY_DELAY_MS);
      } else {
        console.error(`❌ Port ${PORT} still in use after ${MAX_RETRIES} attempts. Exiting.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

// Only start listening if executed directly (e.g. node server.js or npm run dev)
// When imported as a Vercel serverless function, app is exported directly
if (require.main === module) {
  startServer();
}

// Graceful shutdown — lets nodemon cleanly release port before restart
const shutdown = (signal) => {
  console.log(`\n[${signal}] Closing server...`);
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGUSR2', () => {
  if (server) {
    server.close(() => process.kill(process.pid, 'SIGUSR2'));
  } else {
    process.kill(process.pid, 'SIGUSR2');
  }
});

module.exports = app;
