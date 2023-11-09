const mysql = require('mysql2/promise');

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'schemaOH'
        });
        console.log('[+] Connected to MySQL successfully.');

        return connection;
    } catch (error) {
        console.error('Error connecting to MySQL', error);
        process.exit(1);
    }
};




module.exports = { connectDB };