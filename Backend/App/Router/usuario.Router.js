const router = require('express').Router();
// Se importa el controlador de usuario
const { crearusuario, obtenerusuario, eliminarusuario, modificarusuario, login } = require('../Controler/usuario.controler');

// Ruta de usuario
router.get('/', (req, res) => {
    res.send('Ruta de usuario');
});

// Rutas para el usuario
router.post('/crearusuario', crearusuario);
router.get('/obtenerusuario', obtenerusuario);
router.delete('/eliminarusuario', eliminarusuario);
router.put('/modificarusuario', modificarusuario);
router.post('/login', login);

// Se exporta el router
module.exports = router;
