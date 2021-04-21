const Sequelize = require('sequelize');
//import de la configuracion de la coneccion a la base de datos
const db = require('../config/db.js');
const slug = require('slug');
const shortid = require('shortid');
//define es para dar el nombre al modelo, segundo parametro son las columnas que tendra el modelo
const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: Sequelize.STRING,
    url: Sequelize.STRING
}, {
    //ejecuta una funcion en determinado tiempo, tambien depende de cuando se ejecute, before o after 
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;