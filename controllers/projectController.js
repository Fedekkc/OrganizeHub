const Proyecto = require('../src/models/proyecto');
const ProjectDao = require('../src/DAOs/daoProyecto');
const userDao = require('../src/DAOs/daoUsuario');
const { getUserID } = require('../src/DAOs/daoUsuario');
const Tarea = require('../src/models/tarea');
const Team = require('../src/models/team');
const { format } = require('date-fns');

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


async function newProjectRedirect(req, res) {
    res.redirect('/newProject');
}


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
        await ProjectDao.saveProjectChanges(id, 'Project ' + projectName + ' created at ' + new Date());

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
    const changes = await changesThisMonth(id);
    const users = await userDao.getAllUsers();    
    
    
    res.render('projects/project', { project, members, tasks, teams, id, user, changes, users });
}


async function deleteMember(req, res) {
    const { username, projectID } = req.body;
    const userID = await userDao.getUserID(username);
    console.log("userID: " + userID);
    console.log("username: " + username)

    // Comprobamos que el usuario exista
    if (userID == null) {
        console.log("[-] User does not exist");
        res.status(400).send('[-] User does not exist');
        return;
    }

    if(!userDao.isInProject(userID,projectID)){
        console.log("[-] User is not in project");
        res.status(400).send('[-] User is not in project');
        return;
    }



    console.log("username: " + username + " userID: " + userID + " projectID: " + projectID);
    await ProjectDao.deleteMember(projectID,userID);
    await ProjectDao.saveProjectChanges(projectID, 'User ' + username + ' deleted from project at ' + new Date());
    res.redirect('/projects/' + projectID);
}


async function addMember(req, res) {
    const { username, projectID, rol } = req.body;
    const userID = await userDao.getUserID(username);

    // Comprobamos que el usuario exista
    if (userID == null) {
        console.log("[-] User does not exist");
        res.status(400).send('[-] User does not exist');
        return;
    }

    // Comprobamos que el usuario no este en el proyecto
    const projects = await userDao.getUserProjects(userID);
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].idProyecto == projectID) {
            console.log("[-] User already in project");
            res.status(400).send('[-] User already in project');
            return;
        }
    }

    console.log("username: " + username + " userID: " + userID + " projectID: " + projectID);
    await ProjectDao.addMember(projectID,userID,rol);
    await ProjectDao.saveProjectChanges(projectID, 'User ' + username + ' added to project at ' + new Date());
    //Devolvemos success a la ruta sin redireccionar ni renderizar la vista
    res.redirect('/projects/' + projectID);
}
async function addTask(req, res) {
    const { taskName, taskDesc, taskDate, projectID } = req.body;
    const task = new Tarea(projectID, taskName, taskDesc, taskDate, new Date());
    await ProjectDao.addTask(projectID, task);
    await ProjectDao.saveProjectChanges(projectID, 'Task ' + taskName + ' added to project at ' + new Date());
    res.redirect('/projects/' + projectID);
}

async function addTeam(req, res) {
    const { teamName, teamDesc, projectID } = req.body;
    const team = new Team(projectID, teamName, teamDesc, new Date());
    console.log("teamName: " + teamName + " teamDesc: " + teamDesc + " projectID: " + projectID)
    await ProjectDao.addTeam(projectID, team);
    await ProjectDao.saveProjectChanges(projectID, 'Team ' + teamName + ' added to project at ' + new Date());
    res.redirect('/projects/' + projectID);
}

async function changesThisMonth(projectId) {
    try {

        // Obtén la fecha de inicio del mes actual
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        
        // Obtén la lista de cambios realizados en el proyecto desde el inicio del mes hasta la fecha actual
        const changes = await ProjectDao.getProjectChangesSince(projectId, startOfMonth);
    
        // Muestra la cantidad de cambios realizados en el proyecto este mes
        return changes;
    } catch (error) {
        console.error('[-] Error al obtener los cambios del proyecto', error);
        return null;
    }
}

async function editTeam(req, res) {
    const { teamName, teamDesc, teamID, projectID } = req.body;
    const team = new Team(projectID, teamName, teamDesc, new Date());
    await ProjectDao.editTeam(teamID, team);
    await ProjectDao.saveProjectChanges(projectID, 'Team ' + teamName + ' edited at ' + new Date());
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
    deleteMember,
    addTask,
    changesThisMonth,
    addTeam,
    editTeam
}

