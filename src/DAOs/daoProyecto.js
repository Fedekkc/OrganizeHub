const { connectDB } = require('../../db');
const bcrypt = require('bcrypt');
const Proyecto = require('../models/proyecto');
const tarea = require('../models/tarea');
const team = require('../models/team');

class ProjectDao {
    static async createProject(project) {
        if (project) {
            try {
                const connection = await connectDB();
                let query =
                    'INSERT INTO Proyectos (nombreProyecto, idCreador, cantidadMiembros, fechaCreacion, descripcionProyecto, fechaUltModificacion) VALUES (?, ?, ?, ?, ?, ?)';
                const valores = [
                    project.nombreProyecto,
                    project.idCreador,
                    project.cantidadMiembros,
                    project.fechaCreacion,
                    project.descripcionProyecto,
                    project.fechaUltModificacion,
                ];
                const result = await connection.execute(query, valores);
                // Obtenemos el ID del proyecto recién creado por medio de la consulta que te da el ultimo  ID
                query = 'SELECT LAST_INSERT_ID()';
                
                const [rows] = await connection.execute(query);
                let id = rows[0]['LAST_INSERT_ID()'];
                
                await ProjectDao.addMember(id, project.idCreador, 'project-owner');

                console.log('[+] Project successfully created.');
                return result;
            } catch (error) {
                console.error('[-] Error al insertar un proyecto', error);
                return null;
            }
        } else {
            console.error('[-] The project object is undefined or null.');
            return null;
        }
    }

    static async addTask(idProyecto, tarea) {
        if (tarea) {
            try {
                const connection = await connectDB();
                console.log(tarea)
                let query =
                    'INSERT INTO Tareas (idProyecto, nombreTarea, descripcionTarea, fechaEntrega, fechaCreacion) VALUES (?, ?, ?, ?, ?)';
                const valores = [
                    idProyecto,
                    tarea.nombreTarea,
                    tarea.descripcionTarea,
                    tarea.fechaEntrega,
                    tarea.fechaCreacion,
                ];
                const result = await connection.execute(query, valores);
                console.log('[+] Task successfully added.');
                return result;
            } catch (error) {
                console.error('[-] Error al insertar una tarea', error);
                return null;
            }
        } else {
            console.error('[-] The task object is undefined or null.');
            return null;
        }
    }
    
    static async addMember(idProyecto, idUsuario, rol) {
        const connection = await connectDB();
        const query = 'INSERT INTO Usuario_Proyecto (idUsuario, idProyecto, fechaIngreso, rol) VALUES (?, ?,?,?)';
        const valores = [idUsuario, idProyecto, new Date(), rol];
        const result = await connection.execute(query, valores);
        console.log('[+] Member successfully added.');
        return result;
    }
    
    static async getProjectID(idUsuario, nombreProyecto) {
        //Obtenemos todos los proyectos del usuario
        const connection = await connectDB();
        const query = 'SELECT idProyecto FROM Usuario_Proyecto WHERE idUsuario = ?';
        const [rows] = await connection.execute(query, [idUsuario]);
        let data = rows;
        let id = null;
        //Buscamos todos los proyectos con el nombre que nos pasaron
        for (let i = 0; i < data.length; i++) {
            const query = 'SELECT nombreProyecto FROM Proyectos WHERE idProyecto = ?';
            const [rows] = await connection.execute(query, [data[i].idProyecto]);
            let data2 = rows[0];
            //Si el nombre del proyecto es igual al que nos pasaron, obtenemos el id
            if (data2.nombreProyecto == nombreProyecto) {
                id = data[i].idProyecto;
            }
        }
        return id;
    }

    static async findByID(id) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM Proyectos WHERE idProyecto = ?', [id]);
        const data = rows[0];
        
        return new Proyecto(data.idCreador, data.nombreProyecto, data.cantidadMiembros, data.fechaCreacion, data.descripcionProyecto, data.fechaUltModificacion);
    }

    static async update(project) {
        const connection = await connectDB();
        await connection.execute('UPDATE Proyectos SET nombreProyecto = ?, idCreador = ?, cantidadMiembros = ?, fechaCreacion = ?, descripcionProyecto = ?, fechaUltModificacion = ? WHERE idProyecto = ?',
        [project.nombreProyecto, project.idCreador, project.cantidadMiembros, project.fechaCreacion, project.descripcionProyecto, project.fechaUltModificacion, project.getID()]);
    }

    static async delete(id) {
        const connection = await connectDB();
        await connection.execute('DELETE FROM Proyectos WHERE idProyecto = ?', [id]);
    }

    static async getAllProjects() {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM Proyectos');
        return rows.map((project) => new Proyecto(project.idProyecto, project.idCreador, project.nombreProyecto, project.cantidadMiembros, project.fechaCreacion, project.descripcionProyecto, project.fechaUltModificacion));
    }

    static async getProjectMembers(id) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT idUsuario FROM Usuario_Proyecto WHERE idProyecto = ?', [id]);
        const data = rows;
        let members = [];
        for (let i = 0; i < data.length; i++) {
            const [rows] = await connection.execute('SELECT username FROM Usuarios WHERE idUsuario = ?', [data[i].idUsuario]);
            let data2 = rows[0];
            members.push(data2.username);
        }
        
        return members;
    }

    static async deleteMember(idProyecto, idUsuario) {
        const connection = await connectDB();
        await connection.execute('DELETE FROM Usuario_Proyecto WHERE idProyecto = ? AND idUsuario = ?', [idProyecto, idUsuario]);
    }

    static async getProjectTasks(id) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT idTarea FROM Tareas WHERE idProyecto = ?', [id]);
        const data = rows;
        let tasks = [];
        for (let i = 0; i < data.length; i++) {
            const [rows] = await connection.execute('SELECT nombreTarea FROM Tareas WHERE idTarea = ?', [data[i].idTarea]);
            let data2 = rows[0];
            tasks.push(data2.nombreTarea);
        }
        return tasks;
    }

    static async getProyectTeams(id) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT idGrupo FROM GrupoDeTrabajo WHERE idProyecto = ?', [id]);
        const data = rows;
        let teams = [];
        for (let i = 0; i < data.length; i++) {
            const [rows] = await connection.execute('SELECT nombreEquipo FROM Equipos WHERE idEquipo = ?', [data[i].idEquipo]);
            let data2 = rows[0];
            teams.push(data2.nombreEquipo);
        }
        return teams;
                
    }
}

module.exports = ProjectDao;
