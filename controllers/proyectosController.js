//slug transforma un string en un string que pueda ser usado como url 

const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
exports.proyectosHome = async (request, response) => {
    // se pone primero el nombre del archivo que va a renderizar
    //segundo un objeto de ajustes, opciones o otras cosas, en este caso es una variable que contiene el titulo de la pagina
    //a renderizar la cual es index 
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll(
        {
            where: {
                usuarioId: usuarioId,
            }
        }
    );
    response.render('index', {
        nombrePagina: 'Proyectos',
        proyectos,
    });

}

exports.formularioProyecto = async (request, response) => {
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll(
        {
            where: {
                usuarioId: usuarioId,
            }
        }
    );
    response.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (request, response) => {
    // console.log(request.body);

    const { nombre } = request.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al Proyecto' });
    }
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll(
        {
            where: {
                usuarioId: usuarioId,
            }
        }
    );
    if (errores.length > 0) {
        response.render('nuevoProyecto', {
            nombrePagina: 'NuevoProyecto',
            errores,
            proyectos
        })
    } else {
        const usuarioId = response.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        response.redirect('./');
    }
}


//este controlador sirve para ingresar a un proyect0 en especifico y ademas cargar todas las tareas asociadas al id del proyecto
exports.proyectoPorUrl = async (req, response) => {
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });
    if (!proyecto)
        return next();

    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll(
        {
            where: {
                usuarioId: usuarioId,
            }
        }
    );

    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        //     //include es el equivalente a los union y join en Sequalize que es el ORM usado aca
        //     // include: [
        //     //     { model: Proyectos }
        //     // ]
    });
    //render a la vista

    response.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
};

exports.formularioEditar = async (req, res) => {
    //forma correcta de hacer la parte de las consultas, debido a que una no depende  de la otra se deberian ejecutar al 
    //mismo tiempo y no esperar a que termine la anterior
    const usuarioId = response.locals.usuario.id;
    const proyectosPromise = await Proyectos.findAll(
        {
            where: {
                usuarioId: usuarioId,
            }
        }
    );
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
        }
    });
    const [proyecto, proyectos] = await Promise.all([proyectoPromise, proyectosPromise]);
    res.render('nuevoProyecto', {
        proyecto,
        proyectos,
        nombrePagina: 'Editar Proyecto',
    });
}

exports.actualizarProyecto = async (request, response) => {
    // console.log(request.body);

    const { nombre } = request.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un nombre al Proyecto' });
    }
    const usuarioId = response.locals.usuario.id;
    const proyectos = await Proyectos.findAll(
        {
            where: {
                usuarioId: usuarioId,
            }
        }
    );

    if (errores.length > 0) {
        response.render('nuevoProyecto', {
            nombrePagina: 'NuevoProyecto',
            errores,
            proyectos
        })
    } else {
        await Proyectos.update(
            { nombre: nombre },
            { where: { id: request.params.id } }
        );
        response.redirect('./');
    }
}

exports.eliminarProyecto = async (request, res, next) => {
    //request tiene la informacion, con query o params se accede a los datos que llegan al server

    const resultado = await Proyectos.destroy({
        where: {
            url: request.query.urlProyecto
        }
    })
    if (!resultado) {
        return next();
    }

}