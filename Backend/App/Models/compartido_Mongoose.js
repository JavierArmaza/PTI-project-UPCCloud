const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

// Modelo de archivo compartido en Mongoose
const compartido_Mongoose = new Schema({
    "_id": mongoose.ObjectId,
    "ArchivoCompartido": String,
    "tamañoArchivo": String,
    "correoCompartido": String, //Quien me comparte, a quien le comparto
    "correoOwner": String,
    "fechacompartido": String,
    "ipfs_hash": String,
    "permisos": { type: String, enum: ['lectura', 'escritura'], default: 'lectura' },
    archivoOriginal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'archivo_Mongoose',
    },
}, { collection: "Compartido" });

// Se exporta el modelo
const compartido_MongooseModel = model("compartido_Mongoose", compartido_Mongoose);
module.exports = { compartido_Mongoose, compartido_MongooseModel };
