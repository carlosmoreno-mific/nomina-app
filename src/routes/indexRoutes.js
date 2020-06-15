const express = require('express');
const router = express.Router();

router.get('/', async (request, response) => {
  response.render('index', {
    title: 'Inicio',
    layout: 'layouts/home-layout'
    });
});

module.exports = router;