# Instalación para Ubuntu 20.04 LTS

### 1. Instalar docker:

```
sudo apt install docker
```

### 2. Instalar docker compose:

```
sudo apt install docker-compose
```

### 3. Inicializar docker-compose para descargar las imágenes de IPFS y IPFS-Cluster

```
docker-compose up
```

### 4. Cerrar los contenedores con Ctrl-C

### 5. Realizar en todos las máquinas.

### 6. Crear clave secreta.

Tendremos que ejecutar el script ./secret.sh, que nos devuelve una clave en el fichero secret.txt
Esta clave tendrá que ser usada por todos los equipos.

### 7. Configurar el cluster para que use la clave secreta

Tendremos que ir a cada nodo al archivo ./compose/clusterx/service.json, y en el apartado de:

```
"cluster": {
    "peername": "clusteri1",
    "secret": "3a3bb244a1eefdef63c9e19d68d97bd7a45fab6bf13b154254142b3e12a15b9f",
    "leave_on_shutdown": false,
    "listen_multiaddress": [
      "/ip4/0.0.0.0/tcp/9096",
      "/ip4/0.0.0.0/udp/9096/quic"
    ],
}
```
En la clave secret tendremos que insertar nuestro secreto.


### 8. Ir al directorio ./compose/ipfsx/config , es un JSON encubierto

### 9. En el apartado de Identity:

```
"Identity": {
    "PeerID": "12D3KooWKbJSLJSbMqBDuyTjSTnDhvZ8C5Zh4ETw2B18ac5HNqD5",
    "PrivKey": "CAESQCGGrFarBUEYdnc/KO6Q5XIPBx2HqnTKW0+WKo+BblO2kTwZjxdzHBktXE2psJQwd6Ou1xgH4lMfU3eUMftEMoQ="
  },
```

Nosotros nos quedamos con PeerID

### 10. Modificar initipfs.sh:

En la segunda sección, tendremos que añadir por cada máquina que esté activa

```
ipfs bootstrap add "/ip4/IP_MAQUINA/tcp/4001/ipfs/PEER_ID_CONTENEDOR"
```

Poniendo la IP de la máquina donde se aloja el contenedor con el peerID PEER_ID_CONTENEDOR

### 11. Copiar el archivo modificado a todas las máquinas

### 12. Iniciar con ./init.sh en una terminal que no vayamos a usar y que no se vaya a cerrar

Tambien sirven las teminales virtuales (tmux)

### 13. Si el sistema falla, usar ./initClean.sh para resetear los nodos locales y volver a iniciar los nodos.