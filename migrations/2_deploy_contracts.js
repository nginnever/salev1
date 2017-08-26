var MatryxToken = artifacts.require('./MatryxToken.sol')
var Crowdsale = artifacts.require('./Crowdsale.sol')
var TestCrowdsale = artifacts.require('./TestCrowdsale.sol')

var test = true;

module.exports = function(deployer) {
  if(test) {
  	deployer.deploy(TestCrowdsale)
  } else {
    deployer.deploy(Crowdsale, 1503723092, 1503723092, 1503809492, "0x0040077926585455c40ceA126B37bED392aCa8C2")
  }
};
