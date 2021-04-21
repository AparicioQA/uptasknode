const Sequelize = require('sequelize');
//extraer valores de variables.env
require('dotenv').config({ path: 'variables.env' });
const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
    //localhost tambien puede ser  127.0.0.1
    host: process.env.BD_HOST,
    dialect: 'mysql',
    // dialect: 'mysql' | 'sqlite' | 'postgres' | 'mssql',
    port: process.env.BD_PORT,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquiere: 30000,
        idler: 10000
    },

});

module.exports = db;