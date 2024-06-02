En este fichero se indicará cuales fueron los comandos ejecutados para la implementación de Kubernetes.
En caso de que no tengamos docker instalado, lo instalaremos con:

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

Y verificamos si se ha instalado correctamente: sudo docker run hello-world

Una vez tengamos Docker instalado el siguiente paso es instalar Kubernetes, siguiendo la documentación oficial tenemos que ejecutar las comandas:

sudo apt-get update
# apt-transport-https may be a dummy package; if so, you can skip that package
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
# If the directory `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
# sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
# This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
sudo systemctl enable --now kubelet

Ahora ya tenemos Kubernetes en nuestro sistema, pero tenemos que elegir un cgroup driver. 
El recomendado para kubeadm es systemd, por lo tanto creamos el siguiente fichero de configuración kubeadm-config.yaml:

kind: ClusterConfiguration
apiVersion: kubeadm.k8s.io/v1beta3
kubernetesVersion: v1.29.3
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd

Esta es una configuración mínima que sirve para indicar que vamos a usar systemd como cgroup driver.
Ahora ya podemos inicializar el nodo maestro y con él el clúster, como hemos creado una configuración ejecutaremos:

kubeadm init --config kubeadm-config.yaml

Si todo funciona correctamente la salida será: 

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>

El siguiente paso tal y como indica en la salida es elegir un addon de red.
Estos addons estan en https://kubernetes.io/docs/concepts/cluster-administration/addons/, elegiremos uno de estos.
En nuestro caso elegimos Flannel poer lo que ejecutaremos la comanda:

kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

Ahora ya podemos unir los nodos que seran nuestros workers al cluster:

kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>

Una vez creado el cluster con todos los nodos, crearemos los ficheros necesarios para integralo con IPFS.
Estos ficheros son: bootstrap-script-cm.yaml, secret.yaml, ipfs-cluster.yaml y ipfs-service.yaml.

Para el secret necesiataremos hacer unos pasos extra para obtener los tokens necesarios:

Necesitamos generar el cluster secret: $ od  -vN 32 -An -tx1 /dev/urandom | tr -d ' \n' | base64 -w 0 -
Y generar el bootstrap_peer_id y el bootstrap_peer_priv_key, instalamos ipfs-key para hacerlo.
Bootstrap_peer_id: $ ipfs-key | base64 -w 0, de la salida coges el id y lo demás es la private key.
Bootstrap_peer_priv_key: copiamos la private key y la codificamos con base64, $ echo "<INSERT_PRIV_KEY_VALUE_HERE>" | base64 -w 0 -

Ahora si, ya tenemos los cuatro ficheros hechos y configurados. 
Pero como nuestro StatefulSet, creado en el ipfs-cluster.yaml, reclama volumenes para sus contenedores tenemos que crear los persistent volumes correspondientes.
Lo hacemos con los ficheros pv-cluster-storage.yaml y pv-ipfs-storage.yaml.
Al no tener provvedor en la nube, también tuvimos que crear un storageclass en el cual se indicará este hecho con la siguiente línia:

provisioner: kubernetes.io/no-provisioner

Los PVs creados y los volumenes que reclaman los contenedores froman parte todos de este storageclass.
Una vez hecho todo esto, movemos todos los ficheros .yaml necesarios a un mismo directorio y ejecutamos la comanda:

kubectl apply -f .

Ahora ya debería estar funcionando correctamente. Por último hicimos un intento de implementar el Horizontal Pod Autoscaler.
Lo creamos aplicando el hpa.yaml y para obtener las métricas necesarias para que este funcione aplicamos el components.yaml.
Al hacerlo daba problemas Flannel, es decir al intentar comunicar las métricas para el funcionamento del HPA surgían errores.


