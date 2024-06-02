// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RegistroArchivos {
     struct Archivo {
         uint256 id;
         string hashIPFS;
         uint contador;
     }

     Archivo[] public archivos;
    
     // Mapping que asocia el hash de IPFS con el índice del archivo en el array 'archivos'.
     mapping(string => uint256) hashToId;
  
     // Función que toma el hash de un archivo en IPFS.
     function agregarArchivo(string memory _hashIPFS) public {
         // Añade un nuevo 'Archivo' al array 'archivos'. 
         // El id del archivo es la longitud actual del array (que también será su índice), 
         // el hash es el pasado a la función y el contador se inicializa a 0.
         archivos.push(Archivo(archivos.length, _hashIPFS, 0));
        
          // Actualiza el mapping 'hashToId' con el nuevo índice del archivo que se añade.
          hashToId[_hashIPFS] = archivos.length - 1;
     }
    
     // Función que actualiza el contador de accesos de un archivo basado en su hash de IPFS.
     function registrarAcceso(string memory _hashIPFS) public {
         // Obtiene el índice del archivo del mapping 'hashToId' usando el hash.
         uint256 id = hashToId[_hashIPFS];
         archivos[id].contador++;
     }
    
     // Función que devuelve el contador de accesos de un archivo.
     function obtenerContador(string memory _hashIPFS) public view returns (uint256) {
         // Devuelve el valor del contador accediendo directamente al array 'archivos' con el índice obtenido del mapping 'hashToId'.
         return archivos[hashToId[_hashIPFS]].contador;
     }
 }