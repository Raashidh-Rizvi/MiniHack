const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const { connectDB } = require('./config/db');
const { createApp } = require('./app');
async function start() {
  await connectDB();
  const server = createApp().listen(process.env.PORT || 5000, () => console.log('GramaFix API ready'));
  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  return server;
}
if (require.main === module) start().catch(error => { console.error('Server startup failed:', error.name); process.exitCode = 1; });
module.exports = { createApp, start };