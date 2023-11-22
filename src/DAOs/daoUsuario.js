const { connectDB } = require('../../db');
const User = require('../models/usuario');
const bcrypt = require('bcrypt');
class UserDAO {

    static async createUser (user){
        if (user) {
            try {
                const connection = await connectDB();
                const query = "INSERT INTO Usuarios (username, password, email, phone, admin, registerDate, lastLogin) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE email = ?', [user.email]);

                if(rows.length > 0){
                    console.log('[+] User already exists.');
                    return null;
                }
                //Encriptamos la contraseña
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                
                const valores = [user.username, hashedPassword, user.email, user.phone, user.admin, user.registerDate, user.lastLogin];
                const result = await connection.execute(query, valores);
                console.log('[+] User successfully created.');
                return result;
            } catch (error) {
                console.error('Error al insertar un usuario', error);
                return null;
            }
        } else {
            console.error('[-] The user object is undefined or null.');
            return null;
        }
    };

    static async getUserRol(idUsuario, idProyecto) {
        const connection = await connectDB();
        const query = 'SELECT rol FROM Usuario_Proyecto WHERE idUsuario = ? AND idProyecto = ?';
        const [rows] = await connection.execute(query, [idUsuario, idProyecto]);
        let data = rows[0];
        return data.rol;
    }

    static async getUserProjects(id) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT idProyecto FROM Usuario_Proyecto WHERE idUsuario = ?', [id]);
        return rows;
    }

    static async findByID(id) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE idUsuario = ?', [id]);
        const data = rows[0];
        return new User(data.username, data.password, data.email, data.phone, data.admin, data.registerDate, data.lastLogin);
    }

    static async findByUsername(username) {
        const connection = await connectDB();
        var query = "SELECT * FROM Usuarios WHERE username = ?";
        var [rows] = await connection.execute(query, [username]);
        let data = rows[0];
        let user = {
            idUsuario: data.idUsuario,
            username: data.username,
            password: data.password,
            email: data.email,
            phone: data.phone,
            admin: data.admin,
            registerDate: data.registerDate,
            lastLogin: data.lastLogin
        }
        
        //Obtenemos los proyectos a los que pertenece el usuario        
        query = "SELECT * FROM Usuarios INNER JOIN Usuario_Proyecto ON Usuarios.idUsuario = Usuario_Proyecto.idUsuario WHERE Usuarios.idUsuario = ?";
        try {
            [rows] = await connection.execute(query, [data.idUsuario]);
            data = rows[0];
            let projects = [];
            for (let i = 0; i < rows.length; i++) {
                projects.push(rows[i].idProyecto);
            }
            user.projects = projects;
            //Creamos el objeto usuario
            console.log("user info: " + user.username + " " + user.password + " " + user.email + " " + user.phone + " " + user.admin + " " + user.registerDate + " " + user.lastLogin + " " + user.projects);
            return new User(user.username, user.password, user.email, user.phone, user.admin, user.registerDate, user.lastLogin, user.projects);

        }
        catch (error) {
            console.error('Error al obtener los proyectos del usuario', error);
            return null;
        }
        
        

    }

    static async update(id, user) {
        const connection = await connectDB();
        
        // Check if registerDate is a Date object
        if (!(user.registerDate instanceof Date)) {
            user.registerDate = new Date(user.registerDate);
        }
        if (!(user.lastLogin instanceof Date)) {
            user.lastLogin = new Date(user.lastLogin);
        }
        
        // Format the date using MySQL's format function
        const formattedDate = user.registerDate.toISOString().slice(0, 19).replace('T', ' ');
        
        // Format the lastLogin date using MySQL's format function
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
        if (rows.length > 0) {
            return rows[0].idUsuario;
        } else {
            return null;
        }
    }
    

    static async delete(id) {
        const connection = await connectDB();
        await connection.execute('DELETE FROM Usuarios WHERE id = ?', [id]);
    }
}

module.exports = UserDAO;