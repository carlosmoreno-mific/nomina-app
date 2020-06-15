const sequelize = require('sequelize');

//conectando a la base de datos
module.exports = new sequelize('Nomina', 'sa', '1234', {
    host: 'localhost',
    dialect: 'mssql',/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    dialectOptions: {
        options: {
          useUTC: false,
          dateFirst: 1,
          enableArithAbort: true
        }
      },
    define: {
    timestamps: false
    },
  });