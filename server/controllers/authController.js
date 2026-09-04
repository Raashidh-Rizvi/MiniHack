const memoryStore = require('../models/memoryStore');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

// Helper to validate email format
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

// @desc    Get demo users for quick persona switching
// @route   GET /api/auth/demo-users
// @access  Public
const getDemoUsers = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      let users = await User.find().select('-password');
      if (users.length === 0) {
        // Seed initial demo users — use create() so pre-validate hooks run
        const demoData = memoryStore.getDemoUsers().map((u) => ({
          numericId: u.numericId || u.id,
          fullName: u.fullName,
          email: u.email,
          role: u.role,
          communityArea: u.communityArea,
          password: u.password,
        }));
        const created = [];
        for (const data of demoData) {
          try {
            const doc = await User.create(data);
            created.push(doc);
          } catch (e) {
            // Skip duplicates (e.g. user already seeded)
            if (e.code !== 11000) throw e;
          }
        }
        users = created.length > 0 ? created : await User.find().select('-password');
      }
      return res.status(200).json({
        success: true,
        data: users,
      });
    } else {
      const demoData = memoryStore.getDemoUsers().map(({ password, ...rest }) => rest);
      return res.status(200).json({
        success: true,
        data: demoData,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (getIsConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      // Check password (supports default or match)
      if (user.password && user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const userData = user.toJSON();
      delete userData.password;

      return res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        data: userData,
        token: `gramafix_jwt_${user.id}_${Date.now()}`,
      });
    } else {
      // Memory Store Fallback
      const user = memoryStore.findUserByEmail(normalizedEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      if (user.password && user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const { password: _, ...userData } = user;

      return res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        data: userData,
        token: `gramafix_jwt_${user.id}_${Date.now()}`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, communityArea, role } = req.body || {};

    // Validations
    if (!fullName || String(fullName).trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required and must be at least 3 characters.',
      });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address (e.g. name@domain.com).',
      });
    }

    if (!password || String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    let assignedRole = 'CITIZEN';
    if (role === 'OFFICER') {
      assignedRole = 'OFFICER';
    } else if (role === 'ADMIN' || role === 'SYSTEM_ADMIN') {
      assignedRole = 'ADMIN';
    } else {
      assignedRole = 'CITIZEN';
    }
    const area = communityArea && String(communityArea).trim() ? String(communityArea).trim() : 'Matale Town';

    if (getIsConnected()) {
      // Check existing email
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please sign in instead.',
        });
      }

      // Generate numericId
      const lastUser = await User.findOne().sort({ numericId: -1 });
      const nextId = lastUser ? (lastUser.numericId || 100) + 1 : 101;

      const newUser = await User.create({
        numericId: nextId,
        fullName: String(fullName).trim(),
        email: normalizedEmail,
        password: String(password),
        role: assignedRole,
        communityArea: area,
      });

      const userData = newUser.toJSON();
      delete userData.password;

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: userData,
        token: `gramafix_jwt_${newUser.numericId}_${Date.now()}`,
      });
    } else {
      // Memory Store Fallback
      const existingUser = memoryStore.findUserByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please sign in instead.',
        });
      }

      const created = memoryStore.createUser({
        fullName: String(fullName).trim(),
        email: normalizedEmail,
        password: String(password),
        role: assignedRole,
        communityArea: area,
      });

      const { password: _, ...userData } = created;

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: userData,
        token: `gramafix_jwt_${created.id}_${Date.now()}`,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDemoUsers,
  loginUser,
  registerUser,
};
