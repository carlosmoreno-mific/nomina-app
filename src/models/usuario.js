const sequelize = require('sequelize');

const db = require('../config/database');

const empleado = db.define('Usuarios', {
    idUsuario: {
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
    correoElectronico: {
        type: sequelize.STRING
    },
    contrasenna: {
        type: sequelize.STRING
    }
});

module.exports = empleado;