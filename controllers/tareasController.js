const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res) => {
    //obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    // leer valor del input 
    const { tarea } = req.body;
    //estado incompleto  osea 0
    const estado = 0;
    const proyectoId = proyecto.dataValues.id;

    //insertar en database 
    const resultado = await Tareas.create({ tarea, estado, proyectoId });
    if (!resultado) {
        return next();
    }

    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({
        where: {
            id
        }
    })

    let estadoTarea = 0;
    if (estadoTarea === tarea.estado) {
        estadoTarea = 1;
    }
    tarea.estado = estadoTarea;

    const resultado = await tarea.save();

    if (!resultado)
        return next();
    console.log(tarea);
    res.status(200).send("All right");
}

exports.eliminarTarea = async (req, res) => {
    const { id } = req.params;
    const result = await Tareas.destroy({
        where: {
            id: id
        }
    })
    if (!result)
        return next();
    res.status(200).send('Eliminando')
}