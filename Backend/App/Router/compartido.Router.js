const router = require('express').Router();
// Se importa el controlador de compartido
const {ArchivoCompartido, modificararchivocompartido, eliminarArchivoCompartido, obtenerArchivosCompartidos, obtener} = require('../Controler/compartido.controler');

// Ruta de compartidos
router.get('/', (req, res) => {
    res.send('Ruta de compartidos');
});

// Ruta para crear un archivo compartido
router.post('/ArchivoCompartido', ArchivoCompartido);
router.put('/modificararchivocompartido', modificararchivocompartido);
router.delete('/eliminarArchivoCompartido', eliminarArchivoCompartido); 
router.post('/obtenerArchivosCompartidos', obtenerArchivosCompartidos);
router.post('/obtener', obtener);

// Se exporta el router
module.exports = router;
