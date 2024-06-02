const router = require('express').Router();
const multer = require('multer')  

// Se importa el controlador de archivo
const { creararchivo, obtenerarchivo, modificararchivo, eliminararchivo, getall, archivararchivo, archivores ,getBlockchainData} = require('../Controler/archivo.controler');

// Se crea el storage para multer
const storage = multer.memoryStorage({limits: { fileSize: 524288000 }});
const upload = multer({ storage }); 

// Se crean las rutas para el archivo
router.get('/',(req, res)=>{
    res.send('Ruta de archivo');
});
router.post('/creararchivo',upload.single('file'), creararchivo);
router.post('/obtenerarchivo', obtenerarchivo);
router.delete('/eliminararchivo', eliminararchivo);
router.put('/modificararchivo', modificararchivo);
router.post('/getall', getall);
router.put('/archivararchivo', archivararchivo);
router.put('/archivores', archivores);
router.post('/blockchain',getBlockchainData);

// Se exporta el router
module.exports = router;
