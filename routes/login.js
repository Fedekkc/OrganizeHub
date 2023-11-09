const express = require('express');

const loginController = require('../controllers/loginController');

const router = express.Router();

router.get('/login', loginController.login);
router.get('/signup', loginController.signup);
router.post('/signup', loginController.saveUser);
router.post('/login', loginController.loginUser);

module.exports = router;