// Vercel Serverless Function entrypoint
// Env vars come from Vercel dashboard — dotenv is not needed here
// but we fall back gracefully for local testing
try { require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') }); } catch (_) {}
try { require('dotenv').config({ path: require('path').join(__dirname, '../.env.production') }); } catch (_) {}

// JWT fallback for zero-config
process.env.JWT_SECRET = process.env.JWT_SECRET || 'gramafix_super_secret_jwt_key_hackathon_2026';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const { connectDB } = require('../server/config/db');
const { createApp } = require('../server/app');

// Create app once (reused across warm invocations)
const app = createApp();

module.exports = async (req, res) => {
  await connectDB().catch((err) => {
    console.error('DB connect error:', err.message);
  });
  app(req, res);
};
