const express = require('express');

const loginController = require('../controllers/loginController');

const router = express.Router();

router.get('/login', loginController.login);
router.get('/signup', loginController.signup);
router.get('/profile', loginController.profile);
router.post('/signup', loginController.saveUser);
router.post('/login', loginController.loginUser);

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;