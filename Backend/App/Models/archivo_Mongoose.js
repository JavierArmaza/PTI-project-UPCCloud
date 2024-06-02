const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

// Modelo de archivo en Mongoose
const archivo_Mongoose = new Schema({
    "_id": mongoose.ObjectId,
    "nombreArchivo": String,
    "fecha": String,
    "tamano": String,
    "ipfs_hash": String,
    "estado": { type: String, enum: ['activo', 'eliminado', 'archivado'], default: 'activo'},
    propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', 
    },
}, { collection: "archivo" })

// Se exporta el modelo
const archivo_MongooseModel = model("archivo_Mongoose", archivo_Mongoose);
module.exports = { archivo_Mongoose, archivo_MongooseModel };