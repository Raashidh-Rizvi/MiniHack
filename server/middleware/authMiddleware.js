/**
 * Authentication and Role-Based Authorization Middleware Wrapper
 */
const { requireAuth, requireRole } = require('./auth');

/**
 * protect — Verify authentication credentials (token or session headers)
 * and attach decoded user payload to req.user: { id, role, email, fullName }
 */
const protect = requireAuth;

module.exports = { protect, requireRole, extractUser: requireAuth };
