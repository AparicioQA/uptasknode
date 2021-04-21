// import express from 'express';
const express = require('express');
const routes = require('./routes');
const path = require('path');
require('express-validator');
const flash = require('connect-flash');
//helpers con algunas funciones
const helpers = require('./helpers');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//crear conexion a la BD
const db = require('./config/db');
//importar variables de entorno
require('dotenv').config({ path: 'variables.env' });


//importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync().then(() => console.log("Conectado al Server")).catch(error => console.log(error))
//crear una aplicacion de express 
//contiene todo lo nesesario para crear un servidor de express
const app = express();

//De donde cargar los archivos estaticos en este caso el css
app.use(express.static('public'));

//Habilitar pug
app.set('view engine', 'pug');

//habilitar bodyParser para poder leer los datos enviados por un formulario desde node
//bodyParser en si esta deprecada por lo cual ahora se usa express.urlencoded y viene en express asi que no se ocupa descargar
//ni instalar, ni importar esa libreria/dependencia
app.use(express.json());
app.use(express.urlencoded()); //Parse URL-encoded bodies

//añadir carpeta con las vistas
//dirname es el directorio principal osea donde esta este archivo
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

//las sessiones nos permiten navegar entre paginas sin volvernos a autoenticar en el login 
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
//pasar var dump a la aplicacion
app.use((request, response, next) => {

    response.locals.usuario = { ...request.user } || null;

    //.locals son variables que pueden ser usadas en cualquier parte del proyecto osea desde cualquier otro directorio del proyecto node 
    response.locals.vardump = helpers.vardump;
    //next debe ir obligatoriamente para que no se  detenga aca

    response.locals.mensajes = request.flash();
    next();
});

//esto es para agregar las rutas al server osea decirle a express que use esas rutas
app.use(routes());
require('./handlers/email');
//puerto que se va a usar para escuchar con el server de express

//servidor y puerto
// el servidor donde se despliegue la aplicacion le asignara la ip sino en local usara la de process que es localhost
const host = process.env.HOST || '0.0.0.0';
//el servidor donde se almacene le asignara el puerto sino en local usara el puerto 3000
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('funcionando');
})