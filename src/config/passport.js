const passport = require('passport');
const Usuario = require('../models/usuario');
var localStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.idUsuario);
});

passport.deserializeUser(function (id, done) {
    Usuario.findOne({
        where: {
            idUsuario: id
        }
    })
    .then(user => {
        done(null, user);
    })
    .catch(err => {
        done(err, null);
    });
});

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async function (request, email, password, done) {

    const usuario = await Usuario.findOne({
        where: {
            correoElectronico: email
        }
    });

    if (usuario) {
        return done(null, false, { message: 'Correo electronico en uso' });
    }

    Usuario.create({
        correoElectronico: email,
        contrasenna: password,
    })
        .then(nuevoUsuario => {
            return done(null, nuevoUsuario);
        })
        .catch(err => {
            return done(err);
        });
}));

passport.use(
    'local',
    new localStrategy(
        { usernameField: 'email' },
        (email, password, done) => {

            Usuario.findOne({
                where: {
                    correoElectronico: email
                }
            })
                .then(user => {
                    console.log(user)
                    if (!user) {
                        return done(null, false, { message: 'Usuario ó contraseña inválido.' });
                    }

                    return user.contrasenna == password ?
                        done(null, user) :
                        done(null, false, { message: 'Usuario ó contraseña inválido.' });
                })
                .catch(() => done(null, false, { message: 'Usuario ó contraseña inválido.' }))
        }
    )
)