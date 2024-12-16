const express = require('express');
const { signupUser, loginUser, getProfile } = require('../controllers/userController');  // Ensure correct imports
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Register route
router.post('/register', signupUser);  // Correctly reference the signup controller

// Login route
router.post('/login', loginUser);  // Correctly reference the login controller

// Profile route
router.get('/profile', protect, getProfile);  // Correctly reference the profile controller, ensure authentication

module.exports = router;
