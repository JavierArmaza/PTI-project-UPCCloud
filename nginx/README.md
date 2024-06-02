# UPCCloud - Nginx

Este readme muestra una guía para poder aplicar la misma configuración en un NginX local que en el proyecto desarrollado.

## Nginx como servidor web

Dentro del directorio `~/nginx/web-server` encontramos toda la configuración creada para el correcto funcionamiento de nginx como servidor web.\
Este directorio intenta simular la jerarquía de directorios del propio nginx localizado en `/etc/nginx`. Miremos paso por paso donde colocar cada fichero:

### ~/nginx.conf
Este fichero tiene que ir en el path `/etc/nginx` y, por tanto, substituir al fichero `/etc/nginx/nginx.conf`.

### ~/sites-available/default

Este fichero tiene que ir en el path `/etc/nginx/sites-available` y, por tanto, substituir el fichero `/etc/nginx/sites-available/default`.

### ~/snippets/*

Los dos ficheros que se encuentran bajo este directorio, es decir, `self-signed.conf` y `ssl-params.conf` han de ir en el path `/etc/nginx/snippets/`.


## Nginx como reverse proxy

Ahora que ya hemos visto la configuración del servidor web, vamos a ver la configuración del reverse proxy. Esta configuración está pensada para tenerla cada una en una máquina distinta. Por lo que si se intentan colocar todos los ficheros en un mismo nginx, seguramente no funcione correctamente.

Dentro del directorio `~/nginx/reverse-proxy` encontramos toda la configuración creada para el correcto funcionamiento de nginx como reverse proxy.\
Al igual que en el caso del servidor web, este directorio intenta simular la jerarquía de directorios del propio nginx localizado en `/etc/nginx`. Miremos paso por paso donde colocar cada fichero:

### ~/nginx.conf
Este fichero tiene que ir en el path `/etc/nginx` y, por tanto, substituir al fichero `/etc/nginx/nginx.conf`.

### ~/conf.d/default.conf
Este fichero tiene que ir en el path `/etc/nginx/conf.d` y, por tanto, substituir al fichero `/etc/nginx/conf.d/default.conf` en caso de que este exista.

### ~/snippets/*

Los dos ficheros que se encuentran bajo este directorio, es decir, `self-signed.conf` y `ssl-params.conf` han de ir en el path `/etc/nginx/snippets/`.


## Activar https y ssl en Nginx
Aunque esto no sea una praxis considerada muy segura, hemos decidido añadir el certificado autofirmado y la clave de encriptación de cada nginx dentro de las carpetas `~/*/ssl`. Esto ha sido para ahorrar tiempo al usuario que quiera hacer pruebas ya que, de esta forma solamente con copiar los archivos al path correspondiente, el sistema ya estará en funcionamiento. De lo contrario, habría que hacer que el propio usuario generase un certificado y una clave a través de openssl.\
Esto último también es posible con los siguientes comandos:
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
```
```bash
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

Para activar la conexión ssl en ambos casos:

### ~/ssl/certs/*

Los dos archivos que se encuentran en este directorio, es decir, `nginx-selfsigned.crt` y `dhparam.pem`, han de ser copiados al directorio `/etc/ssl/certs`.

### ~/ssl/private/nginx-selfsigned.key

Este archivo tiene que ir en el path `/etc/ssl/private`.