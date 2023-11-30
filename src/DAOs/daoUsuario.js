const { connectDB } = require('../../db');
const User = require('../models/usuario');
const bcrypt = require('bcrypt');

class UserDAO {

    static async createUser(user) {
        if (!user) {
            console.error('[-] El objeto de usuario es indefinido o nulo.');
            return null;
        }

        try {
            const connection = await connectDB();
            const [existingRows] = await connection.execute('SELECT * FROM Usuarios WHERE email = ? OR username = ?', [user.email, user.username]);

            if (existingRows.length > 0) {
                if (existingRows.some(row => row.email === user.email)) {
                    console.log('[+] Usuario con correo electrónico ya existe.');
                }
                if (existingRows.some(row => row.username === user.username)) {
                    console.log('[+] Usuario con nombre de usuario ya existe.');
                }
                return null;
            }

            // Encriptamos la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            const query = "INSERT INTO Usuarios (username, password, email, phone, admin, registerDate, lastLogin) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [user.username, hashedPassword, user.email, user.phone, user.admin, user.registerDate, user.lastLogin];
            const result = await connection.execute(query, values);
            console.log('[+] Usuario creado exitosamente.');
            return result;
        } catch (error) {
            console.error('Error al insertar un usuario', error);
            return null;
        }
    }

    static async getAllUsers() {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM Usuarios');
        return rows.map(row => new User(row.username, row.password, row.email, row.phone, row.admin, row.registerDate, row.lastLogin));
    }


    static async getUserRol(idUsuario, idProyecto) {
        const connection = await connectDB();
        const query = 'SELECT rol FROM Usuario_Proyecto WHERE idUsuario = ? AND idProyecto = ?';
        const [rows] = await connection.execute(query, [idUsuario, idProyecto]);
        return rows[0].rol;
    }

    static async getUserProjects(id) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT idProyecto FROM Usuario_Proyecto WHERE idUsuario = ?', [id]);
        return rows.map(row => row.idProyecto);
    }

    static async findByID(id) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE idUsuario = ?', [id]);
        const data = rows[0];
        return new User(data.username, data.password, data.email, data.phone, data.admin, data.registerDate, data.lastLogin);
    }


    static async isInProject(idUsuario, idProyecto) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM Usuario_Proyecto WHERE idUsuario = ? AND idProyecto = ?', [idUsuario, idProyecto]);

        return rows.length > 0;
    }

    static async findByUsername(username) {
        const connection = await connectDB();
        const query = "SELECT * FROM Usuarios WHERE username = ?";
        const [rows] = await connection.execute(query, [username]);
        const user = {
            idUsuario: rows[0].idUsuario,
            username: rows[0].username,
            password: rows[0].password,
            email: rows[0].email,
            phone: rows[0].phone,
            admin: rows[0].admin,
            registerDate: rows[0].registerDate,
            lastLogin: rows[0].lastLogin
        };

        try {
            const projectQuery = "SELECT idProyecto FROM Usuario_Proyecto WHERE idUsuario = ?";
            const [projectRows] = await connection.execute(projectQuery, [user.idUsuario]);
            user.projects = projectRows.map(row => row.idProyecto);

            console.log("Información del usuario:", user);
            return new User(user.username, user.password, user.email, user.phone, user.admin, user.registerDate, user.lastLogin, user.projects);
        } catch (error) {
            console.error('Error al obtener los proyectos del usuario', error);
            return null;
        }
    }

    static async update(id, user) {
        const connection = await connectDB();

        if (!(user.registerDate instanceof Date)) {
            user.registerDate = new Date(user.registerDate);
        }
        if (!(user.lastLogin instanceof Date)) {
            user.lastLogin = new Date(user.lastLogin);
        }

        const formattedDate = user.registerDate.toISOString().slice(0, 19).replace('T', ' ');
        const formattedLastLogin = user.lastLogin.toISOString().slice(0, 19).replace('T', ' ');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        await connection.execute(
            'UPDATE Usuarios SET username = ?, password = ?, email = ?, phone = ?, admin = ?, registerDate = ?, lastLogin = ? WHERE idUsuario = ?',
            [user.username, hashedPassword, user.email, user.phone, user.admin, formattedDate, formattedLastLogin, id]
        );
    }

    static async getUserID(username) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT idUsuario FROM Usuarios WHERE username = ?', [username]);
        return rows.length > 0 ? rows[0].idUsuario : null;
    }

    static async delete(id) {
        const connection = await connectDB();
        await connection.execute('DELETE FROM Usuarios WHERE idUsuario = ?', [id]);
    }
}

module.exports = UserDAO;
