// Importar dependencias
const express = require('express');
const {engine} = require('express-handlebars');
const myconn = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');


const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '\\views');
console.log(app.get('views'));
app.set('port', process.env.PORT || 3000);

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main'
}));

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'organizehub'
}

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conexión a la base de datos establecida con el ID ' + db.threadId);
});

app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado en el puerto ${app.get('port')}`);
});

app.get('/', (req, res) => {
    res.render('home');
});
