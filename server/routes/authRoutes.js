const express = require('express');
const router = express.Router();
const { getDemoUsers, loginUser, registerUser } = require('../controllers/authController');

router.get('/demo-users', getDemoUsers);
router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;
