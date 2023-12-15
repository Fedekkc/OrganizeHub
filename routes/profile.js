const express = require('express');
const router = express.Router();
const authMiddleware = require('../src/middlewares/authMiddleware');
const sessionMiddleware = require('../src/middlewares/sessionMiddleware');
const profileController = require('../controllers/profileController');

// Rutas que requieren autenticación
router.use(authMiddleware);

router.post('/profile', projectController.profile);