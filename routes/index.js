const express = require('express');
const router = express.Router();

// Ruta para la página principal
router.get('/', (req, res) => {
    res.render('index');
});

// Ruta para la página de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para la página de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para la página de proyectos
router.get('/projects', (req, res) => {
    res.render('projects');
});

// Ruta para la página de detalles de proyecto
router.get('/projects/:id', (req, res) => {
    const projectId = req.params.id;
    res.render('project-details', { projectId });
});

// Ruta para la página de creación de proyecto
router.get('/projects/new', (req, res) => {
    res.render('new-project');
});

// Ruta para la página de edición de proyecto
router.get('/projects/:id/edit', (req, res) => {
    const projectId = req.params.id;
    res.render('edit-project', { projectId });
});

// Ruta para la página de eliminación de proyecto
router.get('/projects/:id/delete', (req, res) => {
    const projectId = req.params.id;
    res.render('delete-project', { projectId });
});

module.exports = router;
