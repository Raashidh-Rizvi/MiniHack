/**
 * Authentication and Role-Based Authorization Middleware Wrapper
 */
const { extractUser, requireRole } = require('./auth');

/**
 * protect — Verify authentication credentials (token or session headers)
 * and attach decoded user payload to req.user: { id, role, email, fullName }
 */
const protect = async (req, res, next) => {
  await extractUser(req, res, () => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in first.',
      });
    }
    next();
  });
};

module.exports = { protect, requireRole, extractUser };
