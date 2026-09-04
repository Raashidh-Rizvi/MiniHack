/**
 * Authentication and Role-Based Authorization Middleware (Member 1 & 3)
 */
const { memoryStore } = require('../models/memoryStore');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

/**
 * Extracts and attaches the requesting user context to req.user
 */
const extractUser = async (req, res, next) => {
  try {
    let userId = req.headers['x-user-id'] || req.query.userId || req.query.officerId;
    let role = req.headers['x-user-role'];

    // Check Bearer token format: gramafix_jwt_<id>_<timestamp>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const match = token.match(/gramafix_jwt_(\d+)/);
      if (match && !userId) {
        userId = match[1];
      }
    }

    if (userId) {
      const numericId = Number(userId);
      if (getIsConnected()) {
        const user = await User.findOne({ $or: [{ numericId }, { id: numericId }] });
        if (user) {
          req.user = {
            id: user.numericId || user.id,
            role: user.role,
            fullName: user.fullName,
            email: user.email,
          };
          return next();
        }
      } else {
        const user = memoryStore.findUserById(numericId);
        if (user) {
          req.user = {
            id: user.id || user.numericId,
            role: user.role,
            fullName: user.fullName,
            email: user.email,
          };
          return next();
        }
      }
    }

    // Fallback using provided role header or default
    const fallbackId = role === 'OFFICER' ? 2 : (role === 'ADMIN' ? 3 : 1);
    req.user = {
      id: userId ? Number(userId) : fallbackId,
      role: (role || 'CITIZEN').toUpperCase(),
    };
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Guard that ensures only users with allowed roles can proceed
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role || (req.headers['x-user-role'] ? req.headers['x-user-role'].toUpperCase() : 'CITIZEN');
    const normalizedRole = role === 'RESIDENT' ? 'CITIZEN' : role;
    const normalizedAllowed = allowedRoles.map((r) => (r === 'RESIDENT' ? 'CITIZEN' : r));

    if (!normalizedAllowed.includes(normalizedRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Citizen accounts do not have permission to access ${allowedRoles.join('/')} operations.`,
      });
    }
    next();
  };
};

module.exports = {
  extractUser,
  requireRole,
};
