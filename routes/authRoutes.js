const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', (req, res) => {
    res.send('Auth home page');
});

// Signup route

router.post('/signup', authController.signup);

// Login route
router.get('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;