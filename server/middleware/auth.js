const sessions = require('../services/sessions');
const { fail } = require('../utils/http');

async function requireAuth(req, res, next) {
  try {
    const match = /^Bearer ([a-f0-9]{64})$/.exec(req.get('authorization') || '');
    req.token = match?.[1];
    req.user = await sessions.resolve(req.token);
    if (!req.user) throw fail(401, 'Please sign in again.');
    next();
  } catch (error) {
    next(error);
  }
}

const requireRole = (...roles) => (req, res, next) => {
  const role = req.user?.role === 'RESIDENT' ? 'CITIZEN' : req.user?.role;
  if (!roles.includes(role)) return next(fail(403, 'Your role cannot perform this action.'));
  next();
};

async function optionalAuth(req, res, next) {
  try {
    const match = /^Bearer ([a-f0-9]{64})$/.exec(req.get('authorization') || '');
    req.token = match?.[1];
    if (req.token) {
      req.user = await sessions.resolve(req.token);
    }
  } catch {
    // Non-blocking — unauthenticated requests still proceed
  }
  next();
}

module.exports = {
  requireAuth,
  requireRole,
  optionalAuth,
  extractUser: requireAuth,
};
