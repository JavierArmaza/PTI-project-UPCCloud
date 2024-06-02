const db = require('../Models/server.js');
const usuario = require('../Models/usuario_Mongoose.js');
const mongoose = require('mongoose');
const token = require('../Controler/Token.controler.js');

// Controlador para crear un usuario    
const crearusuario = async (req, res) => {
    const { nombre, clave, correo } = req.body;
    try {
        // Valida que el usuario no exista
        const usuarioExistente = await usuario.usuario_MongooseModel.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).send('El usuario ya existe');
        }
        // Crea un nuevo usuario
        const nuevoUsuario = new usuario.usuario_MongooseModel({
            _id: new mongoose.Types.ObjectId(),
            nombre,
            clave,
            correo
        });
        // Guarda el nuevo usuario
        await nuevoUsuario.save();
        res.status(201).send('Usuario registrado correctamente');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};

// Controlador para obtener un usuario
const obtenerusuario = async (req, res) => {
    try {
        // Obtiene el correo del usuario
        const { correo } = req.body;
        if (correo) {
            // Busca el usuario en la base de datos
            const usuarioExistente = await usuario.usuario_MongooseModel.findOne({ correo });
            if (usuarioExistente) { // Si el usuario existe
                console.log(usuarioExistente);
                return res.json(usuarioExistente);
            } else {
                return res.status(404).send('Usuario no encontrado');
            }
        }
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
}

// Controlador para eliminar un usuario
const eliminarusuario = async (req, res) => {
    try {
        // Obtiene el correo y el token del usuario
        const { correo, token } = req.body;
        const tokenValido = await validartoken(token, correo); 
        // Valida el token
        if (tokenValido) {
            if (correo) {
                // Elimina el usuario
                const usuarioEliminado = await usuario.usuario_MongooseModel.findOneAndDelete({ correo });
                if (usuarioEliminado) {
                    return res.send('Usuario eliminado correctamente');
                } else {
                    return res.status(404).send('Usuario no encontrado');
                }
            } else {
                return res.status(400).send('Correo no proporcionado');
            }
        } else {
            return res.status(401).send('Token no válido');
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};

// Controlador para modificar un usuario
const modificarusuario = async (req, res) => {
    try {
        const { correo, nuevoNombre, nuevaClave, token } = req.body;
        // Valida el token
        const tokenValido = await validartoken(token, correo);
        if (tokenValido) { // Si el token es válido
            if (correo) { // Si el correo es proporcionado
                const usuarioExistente = await usuario.usuario_MongooseModel.findOne({ correo }); // Busca el usuario en la base de datos
                if (usuarioExistente) { // Si el usuario existe
                    // Modifica el usuario
                    usuarioExistente.nombre = nuevoNombre || usuarioExistente.nombre;
                    usuarioExistente.clave = nuevaClave || usuarioExistente.clave;
                    await usuarioExistente.save();
                    return res.send('Usuario modificado correctamente');
                } else {
                    return res.status(404).send('Usuario no encontrado');
                }
            } else {
                return res.status(400).send('Correo no proporcionado');
            }
        }
    } catch (error) {
        console.error('Error al modificar usuario:', error);
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};

// Controlador para iniciar sesión
const login = async (req, res) => {
    try {
        // Obtiene el correo y la clave del usuario
        const { correo, clave } = req.body;
        if (correo && clave) { // Si el correo y la clave son proporcionados
            // Busca el usuario en la base de datos
            const usuarioExistente = await usuario.usuario_MongooseModel.findOne({ correo, clave }); 
            if (usuarioExistente) { // Si el usuario existe
                const tokenres = await token.crearToken(usuarioExistente); // Crea un token
                console.log("Conectado");
                return res.send(JSON.stringify({message: tokenres})); // Devuelve el token
            } else {
                return res.status(404).send('Usuario no encontrado');
            }
        } else {
            return res.status(400).send('Correo o clave no proporcionados');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};

// Exportar funciones
module.exports = { crearusuario, obtenerusuario, eliminarusuario, modificarusuario, login };


