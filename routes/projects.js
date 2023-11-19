// projects.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../src/middlewares/authMiddleware');
const sessionMiddleware = require('../src/middlewares/sessionMiddleware');
const projectController = require('../controllers/projectController');

// Rutas que requieren autenticación
router.use(authMiddleware);


// Utiliza la función showProjects sin invocarla ()
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
router.get('/projects/:id', projectController.getProject);
router.post('/addMember', projectController.addMember);
router.post('/deleteMember', projectController.deleteMember);

module.exports = router;
