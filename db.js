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
        const connection = await pool.getConnection();
        console.log('[+] Connected to MySQL successfully.');
        return connection;
    } catch (error) {
        console.error('Error connecting to MySQL', error);
        throw error; // Re-lanzar el error para que se maneje en el lugar donde se llama a connectDB
    }
};


const disconnectDB = async (connection) => {
    try {
        await connection.release();
        console.log('[+] Disconnected from MySQL successfully.');
    } catch (error) {
        console.error('Error disconnecting from MySQL', error);
    }
}


module.exports = { connectDB, disconnectDB };
