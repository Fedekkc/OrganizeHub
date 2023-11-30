const express = require('express');
const { engine } = require('express-handlebars');
const myconn = require('express-myconnection');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { connectDB, disconnectDB } = require('../db');
const loginRoutes = require('../routes/login');
const projectRoutes = require('../routes/projects');
const session = require('express-session');
const Handlebars = require('handlebars');
const path = require('path');
const daoProyecto = require('../src/DAOs/daoProyecto');
const { start } = require('repl');



const app = express();

Handlebars.registerHelper('in', function(elem, list, options) {
    if(list.indexOf(elem) > -1) {
        return options.fn(this);
    }
    return options.inverse(this);
});

// Configuración del motor de vistas
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'src/styles')));




// Configuración de bodyParser y session
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use((req, res, next) => {
    res.locals.userLoggedIn = req.session.userLoggedIn;


    next();
});






const startApp = async () => {
    try {
        await connectDB();
        app.set('port', process.env.PORT || 3000);
        app.listen(app.get('port'), () => {
            console.log(`[+] Server succesfully started at port: ${app.get('port')}`);
        });
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
    }
};


startApp();


// Ruta de inicio
app.get('/', (req, res) => {
    daoProyecto.getAllProjects().then(projects => {
        console.log("[+] Rendering home");
        console.log(projects);
        res.render('home', { projects });
    });
});
// Rutas
app.use('/', loginRoutes);
app.use('/', projectRoutes);

process.on('SIGINT', async () => {
    console.log('Cerrando la aplicación y la conexión a la base de datos...');
    try {
        // Cierra la conexión a la base de datos
        await disconnectDB();
        console.log('[+] Conexión a la base de datos cerrada exitosamente.');
        process.exit(0);
    } catch (error) {
        console.error('[-] Error desconectando la Base de datos: ', error);
        process.exit(1);
    }
});


