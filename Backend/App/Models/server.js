const mongoose = require('mongoose');
const usuarioModel = require('./usuario_Mongoose.js');
const archivoModel = require('./archivo_Mongoose.js');
const compartidoModel = require('./compartido_Mongoose');

// Conexión a MongoDB
const db = {};
db.mongoose = mongoose;
db.usuarioModel = usuarioModel;
db.archivoModel = archivoModel;
db.compartidoModel = compartidoModel;
module.exports = db;
