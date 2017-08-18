var MatryxToken = artifacts.require('./MatryxToken.sol')
var Crowdsale = artifacts.require('./Crowdsale.sol')

module.exports = function(deployer) {
  MatryxToken.new("0x0040077926585455c40ceA126B37bED392aCa8C2", "mtx", "mtx", 420, 18).then(function(res) {
  	//console.log(res.address)
  	//deployer.deploy(CrowdSale, 420, 420, 420, 420, "0x0040077926585455c40ceA126B37bED392aCa8C2", res.address)
  	deployer.deploy(Crowdsale, 420, 420, res.address, "0x0040077926585455c40ceA126B37bED392aCa8C2")
  })
};
