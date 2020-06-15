const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const csrf = require('csurf');
const passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/perfil', estaConectado, function (request, response, next) {
    var messages = request.flash('success');
    response.render('usuarios/perfil', {
        title: 'Perfil',
        usuario: request.user,
        csrfToken: request.csrfToken(),
        messages,
        hasErrors: messages.length > 0
    });
});

router.put('/:id', estaConectado, function (request, response, next) {
    let { numeroCedula, nombreCompleto } = request.body;

  Usuario.update({
    numeroCedula,
    nombreCompleto
  }, {
    where: {
      idUsuario: request.params.id
    }
  })
    .then(user => {
      request.flash('success', 'Perfil actualizado con exito.');
      response.redirect('/empleados');
    })
    .catch(err => console.log(err));
});

router.get('/cierreSesion', estaConectado, function (request, response, next) {
    request.logout();
    response.redirect('/');
});

router.use('/', noEstaConectado, function (request, response, next) {
    next();
});

router.get('/registro', function (request, response, next) {

    var messages = request.flash('error');

    response.render('usuarios/registro', {
        title: 'Registro',
        csrfToken: request.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });

});

router.post('/registro', passport.authenticate('local.signup', {
    successRedirect: '/usuarios/perfil',
    failureRedirect: '/usuarios/registro',
    failureFlash: true
}));

router.get('/inicioSesion', function (request, response, next) {

    var messages = request.flash('error');

    response.render('usuarios/inicioSesion', {
        title: 'Iniciar sesión',
        csrfToken: request.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/inicioSesion', passport.authenticate('local', {
    successRedirect: '/usuarios/perfil',
    failureRedirect: '/usuarios/inicioSesion',
    failureFlash: true
}));

module.exports = router;

function estaConectado(request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/');
}

function noEstaConectado(request, response, next) {
    if (!request.isAuthenticated()) {
        return next();
    }
    response.redirect('/');
}