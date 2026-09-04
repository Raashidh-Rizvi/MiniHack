const express = require('express');
const router = express.Router();
const { getDemoUsers } = require('../controllers/authController');

router.get('/demo-users', getDemoUsers);

module.exports = router;
