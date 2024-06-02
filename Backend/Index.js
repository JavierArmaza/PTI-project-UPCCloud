const mongoose  = require('mongoose'); // Importa la librería mongoose
const cors = require('cors'); // Importa la librería cors
const express = require('express'); // Importa la librería express
const db = require('./App/Models/server.js'); // Importa el archivo server.js
const app = express(); // Crea la aplicación express
const port = 3001; // Puerto de la aplicación
app.use(cors()); // Usa cors
app.use(express.json()); // Usa express.json
app.use(express.urlencoded({ extended: true })); // Usa express.urlencoded

// Conexión a la base de datos
db.mongoose.connect('mongodb://localhost:27017/Proyecto', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => { // Conexión exitosa
    console.log('Conexión a la base de datos exitosa');
}).catch((error) => { // Error en la conexión
    console.log('Error al conectar a la base de datos');
    console.log(error);
});
app.get('/', (req, res) => { // Ruta principal
 res.send('UPC Cloud database loaded correctly! :)');
});
// Se importa el router principal
require('./App/Router/main.router')(app);
app.listen(port, () => { // Se inicia el servidor
    console.log(`Example app listening at http://localhost:${port}`);
});

