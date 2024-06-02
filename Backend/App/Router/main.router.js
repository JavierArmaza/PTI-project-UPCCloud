const router = require('express').Router();
const usuarioRouter = require('./usuario.Router.js');
const archivoRouter = require('./archivo.Router.js');
const compartidoRouter = require('./compartido.Router.js');

// Se crean las rutas principales
module.exports = app => {
    app.use('/usuario', usuarioRouter);
    app.use('/archivo', archivoRouter);
    app.use('/compartido', compartidoRouter);
}   
