const memoryStore = require('../models/memoryStore');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

// @desc    Get demo users for quick persona switching
// @route   GET /api/auth/demo-users
// @access  Public
const getDemoUsers = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      let users = await User.find();
      if (users.length === 0) {
        // Seed initial demo users
        users = await User.insertMany(memoryStore.getDemoUsers());
      }
      return res.status(200).json({
        success: true,
        data: users,
      });
    } else {
      return res.status(200).json({
        success: true,
        data: memoryStore.getDemoUsers(),
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDemoUsers,
};
