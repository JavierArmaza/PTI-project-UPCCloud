const jwt = require('jsonwebtoken');
const key = 'clave';
const Usuario = require('../Models/usuario_Mongoose'); 
const compartido = require('../Models/compartido_Mongoose');

// Función para crear un token
async function crearToken(usuario) {
    const clave = usuario.clave; // Se obtiene la clave del usuario
    const correo = usuario.correo;  // Se obtiene el correo del usuario
    try {
        // Se verifica si el usuario existe
        const usuarioExistente = await Usuario.usuario_MongooseModel.findOne({ correo }); 
        if (!usuarioExistente) { // Si el usuario no existe
            throw new Error('El usuario no existe'); 
        }
        const token = jwt.sign({ correo, clave }, key, { expiresIn: '24h' }); // Se crea el token
        return token;
    } catch (error) {
        console.error('Error al crear token:', error);
        throw new Error('Error interno del servidor: ' + error.message); 
    }
}

// Función para validar un token
async function validartoken(token, correo) {
    try { // Se verifica si el token es válido
        const usuarioExistente = await Usuario.usuario_MongooseModel.findOne({ correo });
        if (!usuarioExistente) { // Si el usuario no existe
            throw new Error('El usuario no existe');
        }
        const tokenValido = jwt.verify(token, key); // Se verifica si el token es válido
        if (tokenValido.correo == correo){ // Si el token corresponde al usuario
            return tokenValido;
        }
        else {
            throw new Error('El token no corresponde al usuario');
        }
    } catch (error) {
        console.error('Error al validar token:', error);
        throw new Error('Error interno del servidor: ' + error.message);
    }
}

// Exportar funciones
module.exports = { crearToken, validartoken };




