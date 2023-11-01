const db = require('../db');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const connection = await db();
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};

exports.login = async (req, res) => {
    res.render('login');
    const { email, password } = req.body;
    try {
        const connection = await db();
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (!users.length) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, users[0].password);

        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

exports.logout = (req, res) => {
    // Implement your logout logic here
    res.status(200).json({ message: 'User logged out successfully' });
};