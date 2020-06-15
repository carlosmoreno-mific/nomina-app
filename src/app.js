const path = require('path');
const express = require('express');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();

//configuraciones de passport
require('./config/passport');

//conectando a la base de datos
const db = require('./config/database');

db.authenticate()
  .then(() => {
    console.log('***********************************************************');
    console.log('La conexión a la base de datos se ha establecido con éxito.');
    console.log('***********************************************************');
  })
  .catch(err => {
    console.error('No se puede conectar a la base de datos:', err);
  });

//importando rutas
const indexRoutes = require('./routes/indexRoutes');
const empleadosRoutes = require('./routes/empleadoRoutes');
const usuariosRoutes = require('./routes/usuarioRoutes');

//configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//info de sesion
app.use(function (request, response, next) {
  response.locals.login = request.isAuthenticated();
  response.locals.user = request.user;
  next();
});

//rutas
app.use('/', indexRoutes);
app.use('/empleados', empleadosRoutes);
app.use('/usuarios', usuariosRoutes);

app.use((request, response) => {
  response.status(404)
    .render('errors/error', {
      title: 'Error 404 - Pagina no encontrada.'
    });
});

app.listen(app.get('port'), () => {
  console.log('-------------------------------------');
  console.log(`Servidor en puerto ${app.get('port')}`);
  console.log('-------------------------------------');
  console.log(`http://localhost:${app.get('port')}/`);
  console.log('-------------------------------------');

});