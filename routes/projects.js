const express = require('express');

const projectController = require('../controllers/projectController');

const router = express.Router();

router.get('/projects', projectController.projects);
router.get('/newproject', projectController.newProjectView);
router.post('/newProject', projectController.newProject);

module.exports = router;