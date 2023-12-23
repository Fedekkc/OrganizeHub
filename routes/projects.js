// projects.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../src/middlewares/authMiddleware');
const sessionMiddleware = require('../src/middlewares/sessionMiddleware');
const projectController = require('../controllers/projectController');

// Rutas que requieren autenticación
router.use(authMiddleware);



router.get('/projects/:projectID', projectController.getProject);
router.get('/projects', async (req, res) => {
    try {
        await projectController.projects(req, res);
    } catch (error) {
        console.error('Error in /projects route:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/projects', projectController.newProjectRedirect);
router.get('/newProject', projectController.newProjectView);
router.post('/newProject', projectController.newProject);
router.post('/addMember', projectController.addMember);
router.post('/deleteMember', projectController.deleteMember);
router.post('/addTask', projectController.addTask);
router.post('/addTeam', projectController.addTeam);
router.post('/editTeam', projectController.editTeam);

module.exports = router;
