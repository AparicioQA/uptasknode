const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modeo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - Login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario  y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email,
                        activo: 1,
                    }
                })
                //El usuario existe pero puede ser que la contraseña
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
                }
                //cuando el email y password estan bien
                return done(null, usuario);
            } catch (error) {
                //Cuando el usuario no exista
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }


    )

);

// serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//deserializar el usuaio
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;