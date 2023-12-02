const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'schemaOH',
    connectionLimit: 10, // ajusta el límite según tus necesidades
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection(); // Usar pool.getConnection() en lugar de createConnection()
        console.log('[+] Connected to MySQL successfully.');

        return connection;
    } catch (error) {
        console.error('Error connecting to MySQL', error);
        process.exit(1);
    }
};

const disconnectDB = async (connection) => {
    try {
        await connection.release(); // Usar release() en lugar de end() para liberar la conexión al pool
        console.log('[+] Disconnected from MySQL successfully.');
    } catch (error) {
        console.error('Error disconnecting from MySQL', error);
        process.exit(1);
    }
}

module.exports = { connectDB, disconnectDB };
