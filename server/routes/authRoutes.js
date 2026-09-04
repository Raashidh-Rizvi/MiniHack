const express = require('express');
const router = express.Router();
const { getDemoUsers, loginUser, registerUser, sendOtp, verifyOtp, me, logout } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.get('/demo-users', getDemoUsers);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerUser);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

module.exports = router;
