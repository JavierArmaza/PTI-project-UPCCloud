set -ex

#Borramos los peers y los iniciamos manualmente
ipfs bootstrap rm all
ipfs bootstrap add "/ip4/10.4.41.54/tcp/4001/ipfs/12D3KooWSfEjGrx1cjhg2m4idJcgxS2DbByQJzQThCmhmu73EM6Q"
ipfs bootstrap add "/ip4/10.4.41.54/tcp/4001/ipfs/12D3KooWKbJSLJSbMqBDuyTjSTnDhvZ8C5Zh4ETw2B18ac5HNqD5"
ipfs bootstrap add "/ip4/10.4.41.39/tcp/4001/ipfs/12D3KooWBDQwHudbJNMrh7wtsFqGqEx6yhAb9MEJeRp86KyVy7fP"
ipfs bootstrap add "/ip4/10.4.41.39/tcp/4001/ipfs/12D3KooWCCqwkz894skYVfkmF3tzHH55fuXXMfvb5GbxaLQLYGvt"


#Acceptamos la comunicación de los nodos
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://0.0.0.0:5001","http://10.4.41.54:5001","http://10.4.41.39:5001", "http://localhost:3000", "http://127.0.0.1:5001", "https://webui.ipfs.io"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]'


#clave generada en local
