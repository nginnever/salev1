var MatryxToken = artifacts.require('./MatryxToken.sol')
var Crowdsale = artifacts.require('./Crowdsale.sol')

module.exports = function(deployer) {
  MatryxToken.new("0x0040077926585455c40ceA126B37bED392aCa8C2", "MatryxToken", "MTX", 314159265358979323846264338, 18).then(function(res) {
  	deployer.deploy(Crowdsale, 420, 420, res.address, "0x0040077926585455c40ceA126B37bED392aCa8C2")
  })
};
