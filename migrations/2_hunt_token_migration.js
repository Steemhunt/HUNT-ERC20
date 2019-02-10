var Migrations = artifacts.require("./HuntToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
