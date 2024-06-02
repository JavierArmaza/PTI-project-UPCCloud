# UPCCloud - FrontEnd

Este proyecto ha sido creado con React.js

## Estructura de directorios

### /build 
Contiene la propia build de la aplicación. En este directorio actualmente se encuntra la build más reciente del frontend.

### /node_modules 
Contiene las librerias y dependencias necesarias para la ejecución del programa en local. Al final de este documento se encuentra la forma de instalación de estos módulos.


### /public
Contiene los archivos que constituyen la información básica de la aplicación, como pueden ser imágenes estáticas o el icono y texto de la ventana del navegador. En este directorio es donde se encuentra el fichero `index.html`

### /src
Contiene todo el código fuente de la aplicación separado por diferentes carpetas que representan las diferentes páginas que nos encontramos en cada subruta configurada.\
Estas son: `about-us`, `landing-page`, `sing-in`, `sign-up` y `storage-page`.\
Adicionalmente disponemos de un directorio para las imágenes no estáticas.

En este mismo direcotrio, `/src`, encontramos el fichero `config.tsx` el cual contiene la url del backend que luego se exportará en todos los componentes del código fuente que necesiten realizar peticiones al backend.
En caso de querer ejecutar el backend en una máquina distinta a la proporcionada por la FIB, será necesario cambiar el contenido de este fichero con la url de la nueva máquina.

## Scripts básicos de React

En el direcotrio del proyecto, `/pti-proyecto/upccloud-deploy`, puedes ejecutar:

```bash
npm start
```

Este comando pone la aplicación en ejecución en modo desarrollo.\
Puedes abrir [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

Esta página se actualizará con los cambios que hagas en el código sin tener que parar su ejecución.\
En caso de haber algún error de compilación, aparecerá una pantalla en rojo indicando el tipo de error y su mensaje.


```bash
npm run build
```

Crea una build optimizada de la aplicación en el directorio `/upccloud-deploy/build`

Esta build está preparada para reducir y optimizar el código y sus dependencias y los nombres de ficheros se cambian por su hash correspondiente.


```bash
npm install
```

Este comando sirve para instalar los módulos y dependencias explicados anteriormente.
