const Proyecto = require('../src/models/proyecto');
const ProjectDao = require('../src/DAOs/daoProyecto');

// Function to render the projects view

function projects(req, res) {
    res.render('projects/projects');
}

function newProjectView(req, res) {
    res.render('projects/newProject');
}


// Function to render the project view
function showProjects() {
    return async (req, res) => {
        const projects = await ProjectDao.getAllProjects();
        res.render('projects/projects', { projects });
    };
    
}

async function newProject(req, res) {  
    const {projectName, projectDescription} = req.body;
    const user = req.user; 
    //obtener el id del usuario actual con el DAO de usuarios
    
    const userID = await getUserID(user.username);
    
    const project = new Proyecto(userID, projectName, 1, new Date(), projectDescription, new Date());
    await ProjectDao.createProject(project);
    res.redirect('/projects');

}




module.exports = {
    showProjects,
    projects,
    newProject,
    newProjectView,
}

