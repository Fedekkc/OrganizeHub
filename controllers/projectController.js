const Proyecto = require('../src/models/proyecto');
const ProjectDao = require('../src/DAOs/daoProyecto');
const { getUserID } = require('../src/DAOs/daoUsuario');

// Function to render the projects view

function projects(req, res) {
    res.render('projects/projects');
}

function newProjectView(req, res) {
    res.render('projects/newProject');
}

// ...

function newProjectRedirect(req, res) {
    res.render('projects/newProject');
}

// ...


// Function to render the project view
function showProjects() {
    return async (req, res) => {
        const projects = await ProjectDao.getAllProjects();
        res.render('projects/projects', { projects });
    };
    
}

// Function to create a new project

async function newProject(req, res) {  
    const {projectName, projectDescription} = req.body;
    //Obtenemos el usuario actual que almacenamos con el middleware de sesiones
    //con el codigo: res.locals.user = req.session.user;
    const user = res.locals.user;
    
    
    //obtener el id del usuario actual con el DAO de usuarios
    
    console.log("[+] User: " + user);
    const userID = await getUserID(user);
    
    
    const project = new Proyecto(userID, projectName, 1, new Date(), projectDescription, new Date());
    console.log("[+] Project: " + project);
    await ProjectDao.createProject(project);
    res.redirect('/projects');

}




module.exports = {
    showProjects,
    projects,
    newProject,
    newProjectView,
    newProjectRedirect
}

