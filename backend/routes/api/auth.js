const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const authMiddleware = require('../../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.loginUser);

// @route   GET api/auth
// @desc    Get logged in user data
// @access  Private
router.get('/', authMiddleware, authController.getLoggedInUser);

module.exports = router;

//C:\Users\Rushabh\Desktop\SR TEST\backend\routes\api\auth.js