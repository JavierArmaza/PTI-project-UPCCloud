const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

// Modelo de usuario en Mongoose
const usuario_Mongoose = new Schema({
    "_id": mongoose.ObjectId,
    "nombre": String,
    "clave": String,
    "correo": String,
}, { collection: "usuario" });

// Se exporta el modelo
const usuario_MongooseModel = model("usuario_Mongoose", usuario_Mongoose);
module.exports = { usuario_Mongoose, usuario_MongooseModel };
