// Vercel Serverless Function — minimal smoke test
module.exports = (req, res) => {
  res.json({ ok: true, env: { NODE_ENV: process.env.NODE_ENV, HAS_MONGO: !!process.env.MONGO_URI, HAS_JWT: !!process.env.JWT_SECRET } });
};
