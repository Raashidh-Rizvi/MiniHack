// Vercel Serverless Function entrypoint — debug mode
try { require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') }); } catch (_) {}
try { require('dotenv').config({ path: require('path').join(__dirname, '../.env.production') }); } catch (_) {}

process.env.JWT_SECRET = process.env.JWT_SECRET || 'gramafix_super_secret_jwt_key_hackathon_2026';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

let app;
let initError;

try {
  const { createApp } = require('../server/app');
  app = createApp();
} catch (err) {
  initError = err;
  console.error('INIT ERROR:', err.message, err.stack);
}

module.exports = async (req, res) => {
  if (initError || !app) {
    res.status(500).json({
      error: 'Function initialization failed',
      message: initError ? initError.message : 'App not created',
      stack: initError ? initError.stack : undefined,
    });
    return;
  }

  try {
    const { connectDB } = require('../server/config/db');
    await connectDB().catch((err) => console.error('DB error:', err.message));
  } catch (err) {
    console.error('DB import error:', err.message);
  }

  app(req, res);
};
