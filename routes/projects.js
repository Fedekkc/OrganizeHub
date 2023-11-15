const express = require('express');
const router = express.Router();
const authMiddleware = require('../src/middlewares/authMiddleware');
const sessionMiddleware = require('../src/middlewares/sessionMiddleware');
const projectController = require('../controllers/projectController');

// Rutas que requieren autenticación
router.use(authMiddleware);
router.use(sessionMiddleware);

router.get('/projects', projectController.projects);
router.post('/projects', projectController.newProjectView);
router.get('/newProject', projectController.newProjectView);
router.post('/newProject', projectController.newProject);



module.exports = router;