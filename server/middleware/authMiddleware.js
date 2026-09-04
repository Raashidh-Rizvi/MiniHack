const jwt = require('jsonwebtoken');

/**
 * protect — Verify JWT token from Authorization header.
 * Attaches decoded user payload to req.user: { id, role, email }
 * Usage: router.get('/route', protect, handler)
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in first.',
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gramafix_default_secret');
    // decoded shape: { id, role, email, iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or has expired. Please log in again.',
    });
  }
};

/**
 * requireRole — Check that the logged-in user has one of the allowed roles.
 * Must be used AFTER protect middleware.
 * Usage: router.get('/route', protect, requireRole('OFFICER'), handler)
 *        router.get('/route', protect, requireRole('ADMIN', 'OFFICER'), handler)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user?.role || 'unknown'}`,
    });
  }
  next();
};

module.exports = { protect, requireRole };
