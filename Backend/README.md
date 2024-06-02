## Sistema de Almacenamiento y Compartición de Archivos

Este proyecto es un sistema de almacenamiento y compartición de archivos que utiliza tecnologías como Node.js, MongoDB, Express, y JWT para autenticación. El sistema permite a los usuarios almacenar archivos en una base de datos distribuida, acceder a ellos de manera segura y compartirlos con otros usuarios.

## Características

- **Autenticación de Usuarios:** Ingreso seguro mediante el uso de JWT (JSON Web Tokens).
- **Gestión de Archivos:** Subir, descargar, modificar y eliminar archivos.
- **Compartición de Archivos:** Los usuarios pueden compartir archivos y ver estadísticas sobre la popularidad de los archivos compartidos. (Aún no implementado)

## Tecnologías Utilizadas

- **Backend:** Node.js, Express
- **Base de Datos:** MongoDB
- **Autenticación:** JWT

## Instalación

Para poner en marcha el proyecto localmente, sigue estos pasos:

1. **Instalar dependencias:**
    npm install


2. **Instalar y configurar MongoDB:**
    Descargar e instalar MongoDB de [https://www.mongodb.com/try/download/community]
    Asegurarse de que MongoDB está corriendo en tu sistema. 

3. **Configurar variables de entorno:**
    DB_URI=mongodb://localhost:27017/nombreDeTuBaseDeDatos

4. **Iniciar el servidor:**
    Asegurese de estar en la carpeta .\Backend 
    ejecute: node .\Index.js


## Pruebas

Para probar las API endpoints de este proyecto, recomendamos usar Thunder Client en VS Code. Sigue estos pasos para configurarlo y usarlo:

1. **Instalar Thunder Client:**
    Abre VS Code y ve a la sección de extensiones. 
    Busca "Thunder Client" y haz clic en instalar.

2. **Configurar Thunder Client:**
    Una vez instalado, abre Thunder Client desde el ícono en la barra lateral.
    Puedes crear requests manualmente.
    Configura los endpoints que deseas probar.

3. **Ejecutar Requests:**
    Envía tus requests para probar las diferentes funcionalidades de la API.
    Revisa las respuestas directamente en Thunder Client para validar los resultados.


## Ejemplo de Uso

**POST** `http://localhost:3001/usuario/crearusuario`

**Contenido JSON:**
{
"nombre": "PEPE",
"clave": "1234",
"correo": "PEPE@GMAIL.COM"
}

