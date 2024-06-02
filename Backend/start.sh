#!/bin/bash

sudo systemctl start mongod
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
node ./Index.js
