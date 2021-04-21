const Sequelize = require('sequelize');
//import de la configuracion de la coneccion a la base de datos
const db = require('../config/db.js');
const Proyecto = require('./Proyectos');
const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
})
Tareas.belongsTo(Proyecto);
module.exports = Tareas;