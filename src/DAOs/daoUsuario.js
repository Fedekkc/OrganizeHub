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

    static async findByID(id) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE idUsuario = ?', [id]);
        const data = rows[0];
        return new User(data.username, data.password, data.email, data.phone, data.admin, data.registerDate, data.lastLogin);
    }

    static async findByUsername(username) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE username = ?', [username]);
        const data = rows[0];
        return new User(data.username, data.password, data.email, data.phone, data.admin, data.registerDate, data.lastLogin);
    }

    static async update(user) {
        const connection = await connectDB();
        await connection.execute('UPDATE Usuarios SET username = ?, password = ?, email = ?, phone = ?, admin = ?, registerDate = ?, lastLogin = ? WHERE idUsuario = ?', 
        [user.username, user.password, user.email, user.phone, user.admin, user.registerDate, user.lastLogin, user.getID()]);
    }
    
    static async getUserID(username) {
        const connection = await connectDB();
        const [rows] = await connection.execute('SELECT idUsuario FROM Usuarios WHERE username = ?', [username]);
        const data = rows[0];
        return data.idUsuario;
    }
    

    static async delete(id) {
        const connection = await connectDB();
        await connection.execute('DELETE FROM Usuarios WHERE id = ?', [id]);
    }
}

module.exports = UserDAO;