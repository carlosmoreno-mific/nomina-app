const sequelize = require('sequelize');

const db = require('../config/database');

const empleado = db.define('Empleados', {
    IdEmpleado: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numeroCedula: {
        type: sequelize.STRING
    },
    nombreCompleto: {
        type: sequelize.STRING
    },
    sueldoBase: {
        type: sequelize.FLOAT
    },
    correoElectronico: {
        type: sequelize.STRING
    },
});

module.exports = empleado;