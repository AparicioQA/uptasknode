const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');
const { request } = require('express');
exports.formCrearCuenta = async (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'
    })
};

exports.formIniciarSesion = async (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesion en Uptask',
        error
    })
};

exports.crearCuenta = async (req, response) => {
    const { email, password } = req.body;

    try {
        await Usuarios.create({ email, password })
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        const usuario = {
            email
        }

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        })

        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        response.redirect('/iniciar-sesion');
    } catch (error) {

        req.flash('error', error.errors.map(error => error.message));

        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email: email,
            password: password
        });
    }



};

exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer', {
        nombrePagina: 'Restablecer tu Contraseña'
    })
};


exports.confirmarCuenta = async (req, response) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    })

    if (!usuario) {
        req.flash('error', 'No valido');
        response.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Cuenta activada correctamente!');
    response.redirect('/iniciar-sesion');
}