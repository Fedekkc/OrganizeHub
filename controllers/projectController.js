const Proyecto = require('../src/models/proyecto');
const ProjectDao = require('../src/DAOs/daoProyecto');
const userDao = require('../src/DAOs/daoUsuario');
const { getUserID } = require('../src/DAOs/daoUsuario');

// Function to render the projects view

async function projects(req, res) {
    console.log("[+] Rendering projects");
    const projects = res.locals.projects || []; // Retrieve projects from the session
        
    let projectsArray = [];
    
    for (project in projects) {
        const projectObject = Object.create(null);
        console.log("[+] Project: " + projects[project]);
        const projectData = await ProjectDao.findByID(projects[project]);
        Object.assign(projectObject, projectData, { id: projects[project] }); // Add id property to projectObject
        
        projectsArray.push(projectObject);
    }
    console.log(projectsArray);    
    res.render('projects/projects', { projectsArray });
}

function newProjectView(req, res) {
    console.log("[+] Rendering new project view");
    req.session.user = req.session.user || res.locals.user; // set the user property in the session
    req.session.projects = req.session.projects || []; 
    res.render('projects/newProject');
}

// ...

async function newProjectRedirect(req, res) {
    res.redirect('/newProject');
}

// ...


// Function to render the project view
function showProjects() {
    return async (req, res) => {
        console.log("[+] Rendering projects");
        const projects = await ProjectDao.getAllProjects();
        res.render('projects/projects', { projects });
    };
    
}



async function newProject(req, res) {  
    try {
        const {projectName, projectDescription} = req.body;

        //Obtenemos el usuario actual que almacenamos con el middleware de sesiones
        //con el codigo: res.locals.user = req.session.user;
        const user = req.session.user || res.locals.user;

        //obtener el id del usuario actual con el DAO de usuarios
        console.log("[+] User: " + user);
        const userID = await getUserID(user.username);

        const project = new Proyecto(userID, projectName, 1, new Date(), projectDescription, new Date());
        console.log("[+] Project: ");
        console.log(project);
        await ProjectDao.createProject(project);
        //Añadimos el proyecto a la lista de proyectos del usuario (La funcion project.getID no existe)
        //Obtenemos el ID del proyecto recién creado por medio de la consulta que te da el ultimo  ID
        const id = await ProjectDao.getProjectID(userID, projectName);

        //Añadimos el proyecto a la lista de proyectos del usuario
        user.projects.push(id);

        //Actualizamos el usuario en la base de datos
        await userDao.update(userID,user);
        
        //Actualizamos el usuario en la sesion
        req.session.user = user;
        req.session.projects = user.projects; // Store projects in the session
        res.redirect('/projects');
    } catch (error) {
        console.error("[!] Error creating new project:", error);
        res.status(500).send("Error creating new project");
    }
}

// Funcion para renderizar la vista de un proyecto en la ruta /projects/:id

async function getProject(req, res) {
    const id = req.params.id;
    const project = await ProjectDao.findByID(id);
    const members = await ProjectDao.getProjectMembers(id);
    const tasks = await ProjectDao.getProjectTasks(id);
    const teams = await ProjectDao.getProyectTeams(id);
    const user = req.session.user || res.locals.user;

    res.render('projects/project', { project, members, tasks, teams, id, user });

}

async function addMember(req, res) {
    const { username, projectID, rol } = req.body;
    const userID = await userDao.getUserID(username);

    // Comprobamos que el usuario exista
    if (userID == null) {
        console.log("[-] User does not exist");
        res.redirect('/projects/' + projectID);
        return;
    }

    // Comprobamos que el usuario no este en el proyecto
    const projects = await userDao.getUserProjects(userID);
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].idProyecto == projectID) {
            console.log("[-] User already in project");
            res.redirect('/projects/' + projectID);
            return;
        }
    }

    console.log("username: " + username + " userID: " + userID + " projectID: " + projectID);
    await ProjectDao.addMember(projectID,userID,rol);
    res.redirect('/projects/' + projectID);
}

async function deleteMember(req, res) {
    const { username, projectID } = req.body;
    const userID = await userDao.getUserID(username);

    // Comprobamos que el usuario exista
    if (userID == null) {
        console.log("[-] User does not exist");
        res.redirect('/projects/' + projectID);
        return;
    }

    // Comprobamos que el usuario este en el proyecto
    const projects = await userDao.getUserProjects(userID);
    let found = false;
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].idProyecto == projectID) {
            found = true;
        }
    }
    if (!found) {
        console.log("[-] User not in project");
        res.redirect('/projects/' + projectID);
        return;
    }

    console.log("username: " + username + " userID: " + userID + " projectID: " + projectID);
    await ProjectDao.deleteMember(projectID,userID);
    res.redirect('/projects/' + projectID);
}


module.exports = {
    showProjects,
    projects,
    newProject,
    newProjectView,
    newProjectRedirect,
    getProject,
    addMember,
    deleteMember
}

