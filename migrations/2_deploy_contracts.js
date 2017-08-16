var MintableToken = artifacts.require('./MintableToken.sol')
var CrowSale = artifacts.require('./CrowdSale.sol')

module.exports = function(deployer) {
  deployer.deploy(MintableToken)
  deployer.deploy(CrowSale)
};
