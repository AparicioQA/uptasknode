const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
})


//funcion para revisar si el usuario esta logiado
exports.usuarioAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

exports.enviarToken = async (req, res) => {
    //verificar que el usuario exista
    const { email } = req.body;
    const usuario = await Usuarios.findOne({
        where: {
            email: req.body.email
        }
    });

    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.render('restablecer', {
            nombrePagina: "Reestablecer tu contraseña",
            mensajes: req.flash(),
        })
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    await usuario.save();

    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;
    //enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecer-password'
    })
    req.flash('correcto', 'Se envio un mensaje a tu correo')
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {

    const usuario = await Usuarios.findOne({

        where: {
            token: req.params.token
        }
    });

    if (!usuario) {
        req.flash('error', 'No Valido')
        res.redirect('/restablecer');
    }

    res.render('resetPassword', {
        nombrePagina: 'Restablecer Contraseña'
    })
};

exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })
    if (!usuario) {
        req.flash('error', 'No Valido');
        req.redirect('/restablecer');
    }
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    usuario.save();
    req.flash('correcto', 'Tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion');
}