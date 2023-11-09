// Importar dependencias
const express = require('express');
const { engine } = require('express-handlebars');
const myconn = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const { connectDB } = require('../db');

const loginRoutes = require('../routes/login');

const app = express();

// Configuración del motor de vistas
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
console.log(app.get('views'));

// Configuración de bodyParser y session
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Conexión a la base de datos
connectDB();

// Definir el puerto y comenzar el servidor
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log(`[+] Server succesfully started at port: ${app.get('port')}`);
});

// Rutas
app.use('/', loginRoutes);



// Ruta de inicio
app.get('/', (req, res) => {
    res.render('home');
});
