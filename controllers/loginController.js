const User = require('../src/models/usuario');
const { connectDB } = require('../db');
const { createUser, findByUsername, getUserID } = require('../src/DAOs/daoUsuario');
const bcrypt = require('bcrypt');


function login(req, res) {
    res.render('login/index');
}

function signup(req, res) {
    res.render('login/signup');
}


function saveUser(req, res) {

    const registerDate = new Date();
    const lastLogin = new Date();
    const admin = false;
    
    const { username, email, password, phone} = req.body;
    const user = new User(username, password, email, phone, admin, registerDate, lastLogin );

    createUser(user);

    req.session.userLoggedIn = true;

    res.redirect('/');
    
}

async function loginUser(req, res) {
    const { username, password } = req.body;
    
    try {
        const user = await findByUsername(username);
        if (bcrypt.compareSync(password, user.password)) { 
            const userid = await getUserID(user.username); // Espera la resolución de la promesa
            await updateLastLogin(userid); // Espera la resolución de la promesa
            req.session.user = user;
            
            req.session.projects = user.projects; // Store projects in the session
            
            req.session.userLoggedIn = true;
            
            console.log("[+] loginUser(): User logged in");
            res.redirect('/projects');
        } else {
            res.render('login', { error: '[-] Incorrect password' });
            console.log("[-] Incorrect password");
        }
    } catch (error) {
        res.render('login', { error: '[-] This user does not exist.' });
        console.log("[-] Could not find user");
    }
}

async function updateLastLogin(id) {
    try {
        const lastLogin = new Date();
        const connection = await connectDB();
        await connection.execute('UPDATE Usuarios SET lastLogin = ? WHERE idUsuario = ?', [lastLogin, id]);
    } catch (error) {
        // Maneja el error de manera adecuada, ya sea registrándolo, lanzándolo nuevamente o manejándolo de otra forma
        console.error('Error al actualizar la última conexión:', error);
        throw error; // O lanza el error nuevamente si es necesario
        // También puedes manejar el error de otra forma, como retornando un mensaje de error específico o realizando otra acción
    }
}




module.exports = {
    login: login,
    signup: signup,
    saveUser: saveUser,
    loginUser: loginUser

}