var MatryxToken = artifacts.require('./MatryxToken.sol')
var CrowdSale = artifacts.require('./CrowdSale.sol')

module.exports = function(deployer) {
  // MatryxToken.new("0x0040077926585455c40ceA126B37bED392aCa8C2", "mtx", "mtx", 420, 18).then(function(res) {
  // 	console.log(res.address)
  // })
  //deployer.deploy(MatryxToken, "0x0040077926585455c40ceA126B37bED392aCa8C2", "mtx", "mtx", 420, 18)
  deployer.deploy(CrowdSale)
};
