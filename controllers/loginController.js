const User = require('../src/models/usuario');
const { insertUser } = require('../db');

function login(req, res) {
    res.render('login/index');
}

function signup(req, res) {
    res.render('login/signup');
}


function saveUser(req, res) {


    const { Nombre, Correo, Password } = req.body;
    const user = new User(Nombre, Correo, Password);

    insertUser(user);
    
}

module.exports = {
    login: login,
    signup: signup,
    saveUser: saveUser

}