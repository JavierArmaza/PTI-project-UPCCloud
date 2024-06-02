const mongoose = require('mongoose');
const compartido = require('../Models/compartido_Mongoose.js');
const usuario = require('../Models/usuario_Mongoose.js');
const archivo = require('../Models/archivo_Mongoose.js');
const Token = require('../Controler/Token.controler.js'); 
const dayjs = require('dayjs');

// Controlador para compartir un archivo
const ArchivoCompartido = async (req, res) => {
    // Se obtienen los datos del archivo compartido
    const {ArchivoCompartido, correoCompartido, permisos, token, correo} = req.body;
    // Se valida el token
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {
        try {
            // Se verifica si el usuario que comparte el archivo existe
            const archivoExistente = await archivo.archivo_MongooseModel.findOne({ _id: ArchivoCompartido});
            const nombreArchivo = archivoExistente.nombreArchivo; // Se obtiene el nombre del archivo
            const ipfs_hash = archivoExistente.ipfs_hash; // Se obtiene el hash del archivo
            const tamañoArchivo = archivoExistente.tamano; // Se obtiene el tamaño del archivo
            // Se verifica si el archivo a compartir existe
            if (!archivoExistente) {    
                return res.status(404).send('Archivo no encontrado');
            }
            // Se verifica si el usuario a compartir el archivo existe
            const nuevoArchivo = new compartido.compartido_MongooseModel({
                // Se crea un nuevo archivo compartido
                _id: new mongoose.Types.ObjectId(),
                ArchivoCompartido: nombreArchivo,
                tamañoArchivo: tamañoArchivo,
                ipfs_hash: ipfs_hash,
                correoCompartido,
                correoOwner: correo,
                fechacompartido: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'), 
                permisos: permisos,
                archivoOriginal: archivoExistente._id,
            });
            await nuevoArchivo.save(); // Se guarda el archivo compartido
            res.status(201).send('Archivo compartido correctamente');
        } catch (error) {
            console.error('Error al compartir archivo:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }
};

// Controlador para modificar un archivo compartido
const modificararchivocompartido = async (req, res) => {
    const { _id, nuevonombreArchivo, token, correo } = req.body;
    // Se valida el token
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {
        const usuarioExistente = await usuario.usuario_MongooseModel.findOne({ correo });
        // Se verifica si el usuario existe
        if (!usuarioExistente) {
            return res.status(404).send('Usuario no encontrado');
        }
        try {
            const archivoExistente = await compartido.compartido_MongooseModel.findOne({ _id });
            // Se verifica si el archivo compartido existe
            if (!archivoExistente) {
                return res.status(404).send('Archivo no encontrado');
            }
            // Verificar si el usuario tiene permisos para editar el archivo compartido
            const permisosUsuario = await compartido.compartido_MongooseModel.findOne({
                _id: archivoExistente._id, // Asegurarse de que se consulta por el ID del archivo
                permisos: 'escritura'
            });
            console.log(permisosUsuario); // Se imprime en consola los permisos del usuario
            // Se verifica si el usuario tiene permisos para editar el archivo compartido
            if (!permisosUsuario) {
                return res.status(403).send('El usuario no tiene permisos para editar este archivo compartido');
            }
            permisosUsuario.fechacompartido = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            permisosUsuario.ArchivoCompartido = nuevonombreArchivo
            await permisosUsuario.save(); // Se guarda el archivo compartido
            return res.send('Archivo modificado correctamente'); 
        } catch (error) {
            console.error('Error al modificar archivo:', error);
            res.status(500).send('Error interno del servidor: ' + error.message); 
        }
    } else {
        return res.status(401).send('Token no válido');
    }
};

// Controlador para eliminar un archivo compartido
const eliminarArchivoCompartido = async (req, res) => {
    const { _id, token, correo } = req.body;
    // Se valida el token
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {
        const usuarioExistente = await usuario.usuario_MongooseModel.findOne({ correo });
        // Se verifica si el usuario existe
        if (!usuarioExistente) {
            return res.status(404).send('Usuario no encontrado');
        }
    }
    try {
        const archivoCompartido = await compartido.compartido_MongooseModel.findOne({ _id });
        // Se verifica si el archivo compartido existe
        if (!archivoCompartido) {
            return res.status(404).send('Archivo compartido no encontrado');
        }
        // Verificar si el usuario tiene permisos para eliminar el archivo compartido
        if (archivoCompartido.correoCompartido !== correo) {
            return res.status(403).send('El usuario no tiene permisos para eliminar este archivo compartido');
        }
        // Eliminar el archivo compartido
        await compartido.compartido_MongooseModel.findByIdAndDelete(_id);
        return res.send('Archivo compartido eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar archivo compartido:', error);
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};

// Controlador para obtener todos los archivos compartidos con un usuario
const obtenerArchivosCompartidos = async (req, res) => {
    const { correo, token } = req.body;
    // Se valida el token
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {
        try {
            // Se obtienen los archivos compartidos con el usuario
            const archivosCompartidos = await compartido.compartido_MongooseModel.find({ correoCompartido: correo });
            // Se verifica si se encontraron archivos compartidos
            if (!archivosCompartidos || archivosCompartidos.length === 0) {
                return res.status(404).send('No se encontraron archivos compartidos contigo');
            }
            // Se eliminan los campos __v y archivoOriginal de los archivos compartidos
            const archivosSinCampos = archivosCompartidos.map(archivo => {
                const { __v, archivoOriginal, ...archivoSinCampos } = archivo.toObject();
                return archivoSinCampos;
            });
            return res.json({ archivosCompartidos: archivosSinCampos });
        } catch (error) {
            console.error('Error al obtener archivos compartidos:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    } else {
        return res.status(401).send('Token no válido');
    }
};

// Controlador para obtener un archivo compartido por ID
const obtener = async (req, res) => {
    const { _id, correo, token } = req.body;
    const tokenValido = await Token.validartoken(token, correo);
    // Se valida el token
    if (tokenValido) {
        try {
            const archivoCompartido = await compartido.compartido_MongooseModel.findById(_id);
            // Se verifica si el archivo compartido existe
            if (archivoCompartido) {
                // Se retorna el archivo compartido
                return res.status(201).send(JSON.stringify({message:'http://10.4.41.54:8080/ipfs/'+archivoCompartido.ipfs_hash+'?download=true&filename='+archivoCompartido.ArchivoCompartido}));
            }
        } catch (error) {
            console.error('Error al obtener archivo compartido por ID:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    } else {
        return res.status(401).send('Token no válido');
    }
};


// Se exportan los controladores
module.exports = { ArchivoCompartido, modificararchivocompartido, eliminarArchivoCompartido, obtenerArchivosCompartidos, obtener};
