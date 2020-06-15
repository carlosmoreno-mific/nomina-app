const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Empleado = require('../models/empleado');

router.get('/', async (request, response) => {
  const empleados = await Empleado.findAll();

  var messages = request.flash('success');

  response.render('empleados/index', {
    title: 'Empleados',
    empleados,
    messages,
    hasErrors: messages.length > 0
  });
});

router.get('/pagos', estaConectado, async (request, response) => {
  const empleados = await Empleado.findAll();

  var nomina = [];

  empleados.forEach(empleado => {
    var fila = {};
    fila = {
      ...empleado.dataValues,
      salud: empleado.dataValues.sueldoBase * 0.04,
      pension: empleado.dataValues.sueldoBase * 0.04,
      transporte: (empleado.dataValues.sueldoBase > (877803 * 2) ? 0 : 102854),
      totalDevengado: function() { return this.salud + this.pension },
      salarioNeto: function() { return empleado.dataValues.sueldoBase + this.transporte - this.totalDevengado() }
    }
    nomina.push(fila);
  });

  response.render('empleados/pago', {
    title: 'Pagos',
    nomina
  });
});

router.get('/crear', estaConectado, async (request, response) => {
  response.render('empleados/crear', {
    title: 'Crear nuevo empleado',
    empleado: new Empleado()
  });
});

router.get('/editar/:id', estaConectado, async (request, response) => {
  const empleado = await Empleado.findOne({
    where: {
      IdEmpleado: request.params.id
    }
  });

  response.render('empleados/editar', {
    title: 'Editar empleado',
    empleado: empleado,
  });


});

router.get('/:id', async (request, response) => {

  const empleado = await Empleado.findOne({
    where: {
      IdEmpleado: request.params.id
    }
  });

  if (empleado == null) {
    response.redirect('/');
  }

  salud = (empleado.sueldoBase * 0.04);
  pension = (empleado.sueldoBase * 0.04);
  transporte = (empleado.sueldoBase > (877803 * 2) ? 0 : 102854);

  totalDevengado = salud + pension;
  salarioNeto = empleado.sueldoBase + transporte - totalDevengado;

  response.render('empleados/mostrar', {
    title: empleado.nombreCompleto,
    empleado: empleado,
    salud, pension, transporte, totalDevengado, salarioNeto
  });

});

router.post('/', estaConectado, async (request, response, next) => {
  let { numeroCedula, nombreCompleto, sueldoBase, correoElectronico } = request.body;

  Empleado.create({
    numeroCedula,
    nombreCompleto,
    sueldoBase,
    correoElectronico
  })
    .then(empleado => {
      request.flash('success', 'Empleado agregado con exito.');
      response.redirect('/empleados');
    })
    .catch(err => console.log(err));

});

router.put('/:id', estaConectado, async (request, response, next) => {

  let { numeroCedula, nombreCompleto, sueldoBase, correoElectronico } = request.body;

  Empleado.update({
    numeroCedula,
    nombreCompleto,
    sueldoBase,
    correoElectronico
  }, {
    where: {
      IdEmpleado: request.params.id
    }
  })
    .then(empleado => {
      request.flash('success', 'Empleado actualizado con exito.');
      response.redirect('/empleados')
    })
    .catch(err => console.log(err));

});


router.delete('/:id', estaConectado, (request, response) => {

  Empleado.destroy({
    where: {
      IdEmpleado: request.params.id
    }
  }).then(() => {
    request.flash('success', 'Empleado eliminado con exito.');
    response.redirect('/empleados');
  }).catch(err => {
    request.flash('success', 'Ocurrio un error al eliminar.');
    response.redirect('/empleados');
  });


});


module.exports = router;


function estaConectado(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect('/');
}