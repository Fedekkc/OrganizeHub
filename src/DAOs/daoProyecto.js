const { connectDB } = require('../../db');
const bcrypt = require('bcrypt');
const Project = require('../models/proyecto');

class ProjectDao {
    static async createProject(project) {
        if (project) {
            try {
                const connection = await connectDB();
                const query =
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
                console.log('[+] Project successfully created.');
                return result;
            } catch (error) {
                console.error('Error al insertar un proyecto', error);
                return null;
            }
        } else {
            console.error('[-] The project object is undefined or null.');
            return null;
        }
    }

    static async findByID(id) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM Proyectos WHERE idProyecto = ?', [id]);
        const data = rows[0];
        return new Project(data.idProyecto, data.idCreador, data.nombreProyecto, data.cantidadMiembros, data.fechaCreacion, data.descripcionProyecto, data.fechaUltModificacion);
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
        return rows.map((project) => new Project(project.idProyecto, project.idCreador, project.nombreProyecto, project.cantidadMiembros, project.fechaCreacion, project.descripcionProyecto, project.fechaUltModificacion));
    }
}

module.exports = ProjectDao;
