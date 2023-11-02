const mysql = require('mysql2/promise');

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'schemaOH'
        });
        console.log('MySQL connected...');
        return connection;
    } catch (error) {
        console.error('Error connecting to MySQL', error);
        process.exit(1);
    }
};

const insertUser = async (user) => {
    if (user) {
        const connection = await connectDB();
        const userValues = Object.values(user).map(value => (value !== undefined ? value : null));
        const [rows] = await connection.execute('INSERT INTO users SET ?', [userValues]);
        return rows;
    } else {
        // Manejo de errores o mensajes de registro de problemas
        console.error('El objeto de usuario es indefinido o nulo.');
        return null; // O cualquier otro manejo de errores que prefieras
    }
}



module.exports = connectDB;
module.exports = insertUser;