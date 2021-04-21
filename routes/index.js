//express.Router, sirve para traer todas las funciones de express que se encargan de enrutar 
const express = require('express');
const router = express.Router();

//importar express validator, check es una funcion para revisar o checkear las cosas
const { body } = require("express-validator/check");

//importar el controlador 
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
module.exports = function () {
    //una ruta es lo que se va a mostrar atraves del puerto que se puso en listen
    //ruta para el home, es un middleware y son funciones
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome);
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto',
        body('nombre').not().isEmpty().trim().escape(),
        authController.usuarioAutenticado,
        proyectosController.nuevoProyecto);
    //:url es un comodin se usa para que en ese espacio vaya escrito lo que sea 
    //tambien desde request.params.nombreComodin se puede acceder a lo almacenado en el comodin 

    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl);


    router.get("/proyecto/editar/:id",
        authController.usuarioAutenticado,
        proyectosController.formularioEditar);

    router.post('/nuevo-proyecto/:id',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto);

    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto);
    router.post("/proyectos/:url",
        authController.usuarioAutenticado,
        tareasController.agregarTarea);

    //patch se usa para cambiar o hacer update a una pequeña parte de un registro osea un campo o varios pero no todo el registro de la base de datos
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea);
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea);


    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);


    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);


    router.get('/cerrar-sesion', authController.cerrarSesion);


    //reetablecer clave
    router.get('/restablecer', usuariosController.formRestablecerPassword);
    router.post('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.actualizarPassword);
    return router;

}
