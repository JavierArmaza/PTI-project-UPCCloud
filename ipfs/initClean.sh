sudo rm -r ./compose 
sudo docker container kill $(docker container ls -qa)
sudo docker container rm $(docker container ls -qa)


export hostname=(hostname)
docker compose up