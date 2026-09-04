const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env.production') });
require('dotenv').config(); // Fallback to root .env

// Fallback environment variables for zero-config deployments
process.env.JWT_SECRET = process.env.JWT_SECRET || 'gramafix_super_secret_jwt_key_hackathon_2026';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { connectDB } = require('./config/db');
const { createApp } = require('./app');

const PORT = process.env.PORT || 5000;
const app = createApp();

let server;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1500;

async function startServer(attempt = 1) {
  await connectDB();
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
        if (server) server.close();
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

  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Server startup failed:', error);
    process.exitCode = 1;
  });
}

// Graceful shutdown
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

app.createApp = createApp;
app.start = startServer;
module.exports = app;
