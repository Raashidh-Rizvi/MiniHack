const express = require('express');
const router = express.Router();
const { getDemoUsers, loginUser, registerUser } = require('../controllers/authController');
const { validateAuthLogin, validateAuthRegister } = require('../middleware/validator');

router.get('/demo-users', getDemoUsers);
router.post('/login', validateAuthLogin, loginUser);
router.post('/register', validateAuthRegister, registerUser);

module.exports = router;
