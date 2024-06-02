const db = require('../Models/server.js');
const archivo = require('../Models/archivo_Mongoose.js');
const mongoose = require('mongoose');
const usuario = require('../Models/usuario_Mongoose.js');
const Token = require('../Controler/Token.controler.js');
const compartido = require('../Models/compartido_Mongoose.js');
const dayjs = require('dayjs');

// Controlador para manejar las solicitudes de creación de archivos
const creararchivo = async (req, res) => {
    const file = req.file
    const jsonreq = JSON.parse(req.body.JSON)
    const correo = jsonreq.correo
    const token = jsonreq.token
    
    try{
        // Asegura que se haya subido un archivo
        if (!file){
            return res.status(400).send('No se ha enviado arhivo');
        }
        const nombreArchivo= file.originalname
        const tamano = file.size

        // Valida el token del usuario
        const tokenValido = await Token.validartoken(token, correo);
        if (!tokenValido) {
            return res.status(500).send('El token no es valido');
        }

        // Valida que el usuario exista
        const usuarioExistente = await usuario.usuario_MongooseModel.findOne({ correo });
        if (!usuarioExistente) {
            return res.status(500).send('El propietario especificado no existe');
        }
        
        // Sube el archivo a IPFS   
        const blob = new Blob([file.buffer],{type:file.mimetype})
        formData = new FormData()
        formData.append('file',blob,nombreArchivo)
        const response = await fetch(`http://10.4.41.54:9095/api/v0/add`, {
            method: "POST",
            body: formData
        });   

        // Valida la respuesta de IPFS
        if (response.ok) {
            const data = await response.json();
            var ipfs_hash = data["Hash"]
            console.log("Upload succsessful! :)");

            // Crea un nuevo registro de archivo en MongoDB
            const nuevoArchivo = new archivo.archivo_MongooseModel({
                _id: new mongoose.Types.ObjectId(),
                nombreArchivo,
                fecha: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'), 
                tamano,
                ipfs_hash,
                estado: 'activo',
                propietario: usuarioExistente._id,
                permisos: 'escritura'
            });
            await nuevoArchivo.save();
            res.status(201).send('Archivo creado correctamente');
        } 
        else {
            console.error("Error at upload :(");
            throw "IPFS ERROR response"
        }          
    }
    catch(error){
        console.error('Error: ',error)
        res.status(500).send('Error interno del servidor: ' + error);
    }
};

// Controlador para manejar las solicitudes de recuperación de archivos
const obtenerarchivo = async (req, res) => {
    const { _id, correo, token } = req.body;
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {
        try {
            const archivoEncontrado = await archivo.archivo_MongooseModel.findOne({ _id});
            if (archivoEncontrado) {
                return res.status(201).send(JSON.stringify({message:'http://10.4.41.54:8080/ipfs/'+archivoEncontrado.ipfs_hash+'?download=true&filename='+archivoEncontrado.nombreArchivo}));
            }
            else {
                return res.status(404).send('Archivo no encontrado');
            }
        } catch (error) {
            console.error('Error al obtener archivo:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }
};

// Controlador para manejar la obtención de todos los archivos de un usuario
const getall = async (req, res) => {
    const { correo, token } = req.body;
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {    
        try {
            const usuarioExistente = await usuario.usuario_MongooseModel.findOne({ correo }).select('-__v');
            const archivosEncontrados = await archivo.archivo_MongooseModel
                .find({ propietario: usuarioExistente._id })
                .select('-__v -propietario');
            if (archivosEncontrados.length > 0) {
                const archivosModificados = archivosEncontrados.map(archivo => {
                    const archivoObj = archivo.toObject ? archivo.toObject() : archivo;
                    return { ...archivoObj, correo: usuarioExistente.correo };
                });
                const respuesta = {
                    propietario: usuarioExistente._id,
                    archivos: archivosModificados
                };
                return res.json(respuesta);
            } else {
                return res.status(404).send('Archivos no encontrados para el usuario');
            }
        } catch (error) {
            console.error('Error al obtener los archivos:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }
};

// Controlador para manejar las solicitudes de modificación de archivos
const modificararchivo = async (req, res) => {
    const { _id,  nuevonombreArchivo, correo, token } = req.body;
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {
        try {
            const archivoExistente = await archivo.archivo_MongooseModel.findOne({_id});
            if (!archivoExistente) {
                return res.status(404).send('Archivo no encontrado');
            }
            archivoExistente.fecha = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            archivoExistente.nombreArchivo = nuevonombreArchivo;
            await archivoExistente.save();
            return res.send('Archivo modificado correctamente');
        } catch (error) {
            console.error('Error al modificar archivo:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }
};

// Controlador para manejar las solicitudes de eliminación de archivos
const eliminararchivo = async (req, res) => {
    const {correo, token, _id} = req.body;
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {
        try {
            const archivoEliminado = await archivo.archivo_MongooseModel.findOneAndDelete({ _id });
            if (!archivoEliminado) {
                return res.status(404).send('Archivo no encontrado');
            }
            const hash=archivoEliminado.hash;
            const response = await fetch("http://10.4.41.54:8080/ipfs/"+"pins/"+hash,{
                method: "delete",
            }); 
            //await compartido.deleteMany({ ArchivoCompartido: _id });
            res.send('Archivo eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }    
};

// Controlador para manejar las solicitudes de papelera de archivos
const archivararchivo = async (req, res) => {
    const {correo, token, _id} = req.body;
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {
        try {
            const archivoArchado = await archivo.archivo_MongooseModel.findOneAndUpdate(
                { _id},
                { estado: 'archivado'},
                { new: true }
            );
            if (!archivoArchado) {
                return res.status(404).send('Archivo no encontrado');
            }
            //await compartido.deleteMany({ ArchivoCompartido: _id });
            res.send('Archivo archivado correctamente');
        } catch (error) {
            console.error('Error al archivar archivo:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }    
};

// Controlador para manejar las solicitudes de restauración de archivos
const archivores = async (req, res) => {
    const {correo, token, _id} = req.body;
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {
        try {
            const archivoresta = await archivo.archivo_MongooseModel.findOneAndUpdate(
                { _id},
                { estado: 'activo' },
                { new: true }
            );  
            if (!archivoresta) {
                return res.status(404).send('Archivo no encontrado');
            }
            res.send('Archivo restaurado correctamente');
        } catch (error) {
            console.error('Error al restaurar archivo:', error);
            res.status(500).send('Error interno del servidor: ' + error.message);
        }
    }   
};

// Controlador para manejar la obtención de datos de blockchain de un archivo
const getBlockchainData = async(req,res)=>{
    const { _id, correo, token } = req.body;
    const tokenValido = await Token.validartoken(token, correo);
    if (tokenValido) {
        try{
            var TimesShared = 0;
            var TimesViewed = 0;
            const respuesta = {
                shared: TimesShared,
                viewed: TimesViewed
            };
            return res.json(respuesta);
        }  
        catch(error){
            console.error("blockchain error: ",error)
            const respuesta = {
                shared: 0,
                viewed: 0
            };
            return res.json(respuesta);
        } 

    }
}


// Exportar controladores
module.exports = { creararchivo, obtenerarchivo, modificararchivo, eliminararchivo, getall, archivararchivo, archivores, getBlockchainData};
