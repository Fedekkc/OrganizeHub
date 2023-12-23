const { connectDB, disconnectDB } = require('../../db');
const bcrypt = require('bcrypt');
const Proyecto = require('../models/proyecto');
const tarea = require('../models/tarea');
const Team = require('../models/team');

class ProjectDao {
    static async createProject(project) {
        let connection;
        try {
            connection = await connectDB();

            // Inicia la transacción
            await connection.beginTransaction();

            console.log('[+] Creating project...');

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

           

            // Obtenemos el ID del proyecto recién creado por medio de la consulta que te da el último ID
            query = 'SELECT LAST_INSERT_ID()';
            const [rows] = await connection.execute(query);
            let id = rows[0]['LAST_INSERT_ID()'];

            // Ahora puedes realizar otras operaciones en la misma transacción, por ejemplo, agregar miembros
            await ProjectDao.addMember(id, project.idCreador, 'project-owner', connection);
            console.log('[+] Project owner successfully added.');
            // Commit de la transacción
            await connection.commit();

            console.log('[+] Project successfully created.');
            return result;
        } catch (error) {
            // Si hay un error, realiza un rollback para deshacer todas las operaciones
            if (connection) {
                await connection.rollback();
            }
            console.error('[-] Error al insertar un proyecto', error);
            return null;
        } finally {
            if (connection) {
                // Independientemente de si hay éxito o error, libera la conexión al pool
                await disconnectDB(connection);
            }
        }
    }

    static async addTask(idProyecto, tarea, connection = null) {
        connection = connection || await connectDB();
        try {
            

            // Inicia la transacción
            await connection.beginTransaction();

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

            // Commit de la transacción
            await connection.commit();

            console.log('[+] Task successfully added.');
            return result;
        } catch (error) {
            // Si hay un error, realiza un rollback para deshacer todas las operaciones
            if (connection) {
                await connection.rollback();
            }
            console.error('[-] Error al insertar una tarea', error);
            return null;
        } finally {
            if (connection) {
                // Independientemente de si hay éxito o error, libera la conexión al pool
                await disconnectDB(connection);
            }
        }
    }
    
    static async addMember(idProyecto, idUsuario, rol, connection = null) {
        connection = connection || await connectDB();
        let transaction;
        try {
            // Iniciar la transacción
            console.log('[+] Starting transaction...');
            transaction = await connection.beginTransaction();
            
            const query = 'INSERT INTO Usuario_Proyecto (idUsuario, idProyecto, fechaIngreso, rol) VALUES (?, ?,?,?)';
            const valores = [idUsuario, idProyecto, new Date(), rol];

            console.log('[+] Adding member...');
            const result = await connection.execute(query, valores);
    
            // Confirmar la transacción
            console.log('[+] Committing transaction...');
            await connection.commit();
    
            console.log('[+] Member successfully added.');
            return result;
        } catch (error) {
            // Si hay un error, revertir la transacción
            if (transaction) {
                console.log('[-] Rolling back transaction...');
                await connection.rollback();
            }
    
            console.error('[-] Error al añadir un miembro', error);
            return null;
        } finally {
            if (connection) {
                // Independientemente de si hay éxito o error, libera la conexión al pool
                await disconnectDB(connection);
            }
        }
    }
    
    static async addTeam(idProyecto, team, connection = null) {
        if (team) {
            connection = connection || await connectDB();
            let transaction;
    
            try {
                // Iniciar la transacción
                transaction = await connection.beginTransaction();
    
                const query = "INSERT INTO GrupoDeTrabajo (idProyecto, nombreGrupo, descripcionGrupo, fechaCreacion) VALUES (?, ?, ?,?)";
                const valores = [idProyecto, team.nombreGrupo, team.descripcionGrupo, team.fechaCreacion];
                const result = await connection.execute(query, valores);
    
                // Confirmar la transacción
                await connection.commit();
    
                console.log('[+] Team successfully added.');
                return result;
            } catch (error) {
                // Si hay un error, revertir la transacción
                if (transaction) {
                    await connection.rollback();
                }
    
                console.error('[-] Error al añadir un equipo', error);
                return null;
            } finally {
                if (connection) {
                    // Independientemente de si hay éxito o error, libera la conexión al pool
                    await disconnectDB(connection);
                }
            }
        } else {
            console.error('[-] The team object is undefined or null.');
            return null;
        }
    }
    
    static async editTeam(teamId, team, connection = null) {
        if (team) {
            connection = connection || await connectDB();

            let transaction;
    
            try {
                // Iniciar la transacción
                transaction = await connection.beginTransaction();
    
                const query = "UPDATE GrupoDeTrabajo SET nombreGrupo = ?, descripcionGrupo = ? WHERE idGrupo = ?";
                const valores = [team.nombreGrupo, team.descripcionGrupo, teamId];
                const result = await connection.execute(query, valores);
    
                // Confirmar la transacción
                await connection.commit();
    
                console.log('[+] Team successfully edited.');
                return result;
            } catch (error) {
                // Si hay un error, revertir la transacción
                if (transaction) {
                    await connection.rollback();
                }
    
                console.error('[-] Error al editar un equipo', error);
                return null;
            } finally {
                if (connection) {
                    // Independientemente de si hay éxito o error, libera la conexión al pool
                    await disconnectDB(connection);
                }
            }
        } else {
            console.error('[-] The team object is undefined or null.');
            return null;
        }
    }
    

    static async getProjectID(idUsuario, nombreProyecto, connection = null) {
        try {
            //Obtenemos todos los proyectos del usuario
            connection = connection || await connectDB();
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
        } catch (error) {
            console.error(`Error getting project ID for user ${idUsuario} and project ${nombreProyecto}:`, error);
            throw error; // Re-throw the error so it can be caught and handled by the calling function
        } finally {
            if (connection) {
                await disconnectDB(connection);
            }
        }
    }

    static async findByID(id, connection = null) {
        try {
            connection = connection || await connectDB();
            const [rows] = await connection.execute('SELECT * FROM Proyectos WHERE idProyecto = ?', [id]);
            const data = rows[0];
            return new Proyecto(data.idCreador, data.nombreProyecto, data.cantidadMiembros, data.fechaCreacion, data.descripcionProyecto, data.fechaUltModificacion);
        } catch (error) {
            console.error(`Error finding project with ID ${id}:`, error);
            throw error; // Re-throw the error so it can be caught and handled by the calling function
        }
        finally {
            await disconnectDB(connection);
        }

    }

    static async update(project, connection = null) {
        connection = connection || await connectDB();
        await connection.execute('UPDATE Proyectos SET nombreProyecto = ?, idCreador = ?, cantidadMiembros = ?, fechaCreacion = ?, descripcionProyecto = ?, fechaUltModificacion = ? WHERE idProyecto = ?',
        [project.nombreProyecto, project.idCreador, project.cantidadMiembros, project.fechaCreacion, project.descripcionProyecto, project.fechaUltModificacion, project.getID()]);
    }

    static async delete(id, connection = null) {
        connection = connection || await connectDB();
        try {
            await connection.execute('DELETE FROM Proyectos WHERE idProyecto = ?', [id]);
        } catch (error) {
            console.error('[-] Error al eliminar un proyecto', error);
            throw error; // Re-lanzar el error para que la transacción lo maneje
        } finally {
            if (connection) {
                // Independientemente de si hay éxito o error, libera la conexión al pool
                await disconnectDB(connection);
            }
        }
    }

    static async getAllProjects(connection = null) {
        connection = connection || await connectDB();
        try {
            const [rows] = await connection.execute('SELECT * FROM Proyectos');
            const projects = rows.map((project) => new Proyecto(project.idCreador, project.nombreProyecto, project.cantidadMiembros, project.fechaCreacion, project.descripcionProyecto, project.fechaUltModificacion));
            return projects;
        } catch (error) {
            console.error('[-] Error al obtener todos los proyectos', error);
            throw error;
        } finally {
            await disconnectDB(connection);
        }
    }
    

    static async getProjectMembers(id, connection = null) {
        connection = connection || await connectDB();
        try {
            connection = await connectDB();
            const [rows] = await connection.execute('SELECT idUsuario FROM Usuario_Proyecto WHERE idProyecto = ?', [id]);
            const data = rows;
            let members = [];
    
            for (let i = 0; i < data.length; i++) {
                const [userRows] = await connection.execute('SELECT username FROM Usuarios WHERE idUsuario = ?', [data[i].idUsuario]);
                let data2 = userRows[0];
                members.push(data2.username);
            }
    
            return members;
        } catch (error) {
            console.error('[-] Error al obtener los miembros del proyecto', error);
            throw error;
        } finally {
            await disconnectDB(connection);
        }
    }
    

    static async deleteMember(idProyecto, idUsuario, connection = null) {
        try {
            connection = connection || await connectDB();
            await connection.beginTransaction();
    
            await connection.execute('DELETE FROM Usuario_Proyecto WHERE idProyecto = ? AND idUsuario = ?', [idProyecto, idUsuario]);
    
            await connection.commit();
            console.log('[+] Member successfully deleted.');
        } catch (error) {
            console.error('[-] Error al eliminar un miembro', error);
            await connection.rollback(); // Revertir la transacción en caso de error
            throw error; // Re-lanzar el error para que se maneje fuera de la función
        } finally {
            await disconnectDB(connection);
        }
    }
    

    static async getProjectTasks(id, connection = null) {
        connection = connection || await connectDB();

        let tasks = [];
    
        try {
            await connection.beginTransaction();
    
            const [rows] = await connection.execute('SELECT idTarea FROM Tareas WHERE idProyecto = ?', [id]);
            const data = rows;
    
            for (let i = 0; i < data.length; i++) {
                const [rows] = await connection.execute('SELECT * FROM Tareas WHERE idTarea = ?', [data[i].idTarea]);
                let data2 = rows[0];
                tasks.push(data2);
            }
    
            await connection.commit();
            return tasks;
        } catch (error) {
            console.error('[-] Error al obtener tareas del proyecto', error);
            await connection.rollback(); // Revertir la transacción en caso de error
            throw error; // Re-lanzar el error para que se maneje fuera de la función
        } finally {
            await disconnectDB(connection);
        }
    }
    

    static async getProyectTeams(id, connection = null) {
        connection = connection || await connectDB();
        let teams = [];
    
        try {
            await connection.beginTransaction();
    
            const [rows] = await connection.execute('SELECT idGrupo FROM GrupoDeTrabajo WHERE idProyecto = ?', [id]);
            const data = rows;
    
            for (let i = 0; i < data.length; i++) {
                const [rows] = await connection.execute('SELECT * FROM GrupoDeTrabajo WHERE idGrupo = ?', [data[i].idGrupo]);
                let data2 = rows[0];
                teams.push(new Team(id, data2.nombreGrupo, data2.descripcionGrupo, data2.fechaCreacion));
            }
    
            await connection.commit();
            return teams;
        } catch (error) {
            console.error('[-] Error al obtener equipos del proyecto', error);
            await connection.rollback(); // Revertir la transacción en caso de error
            throw error; // Re-lanzar el error para que se maneje fuera de la función
        } finally {
            await disconnectDB(connection);
        }
    }
    
    static async saveProjectChanges(id, cambios, connection = null) {
        try {
            connection = connection || await connectDB();
            const query = 'INSERT INTO Registro_Mensual (idProyecto, cambio, fechaCambio) VALUES (?, ?, ?)';
            const valores = [id, cambios, new Date()];
            const result = await connection.execute(query, valores);
            console.log('[+] Changes successfully saved.');
            return result;
        } catch (error) {
            console.error('[-] Error al guardar cambios del proyecto', error);
            throw error; // Re-lanzar el error para que la transacción lo maneje
        }
    }

    static async getProjectChangesSince(id, fecha, connection = null) {
        connection = connection || await connectDB();
        try {
            const query = 'SELECT * FROM Registro_Mensual WHERE idProyecto = ? AND fechaCambio > ?';
            const valores = [id, fecha];
            const [rows] = await connection.execute(query, valores);
            return rows;
        } catch (error) {
            console.error('[-] Error al obtener cambios del proyecto', error);
            throw error; // Re-lanzar el error para que la transacción lo maneje
        } finally {
            await disconnectDB(connection);
        }
    }
}



module.exports = ProjectDao;
