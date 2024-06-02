const RegistroArchivos = artifacts.require("RegistroArchivos");

module.exports = function(deployer) {
  deployer.deploy(RegistroArchivos);
};