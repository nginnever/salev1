var Crowdsale = artifacts.require("./Crowdsale.sol")

contract('Crowdsale', function(crowd) {
  it("Token is deployed", function() {
    return Crowdsale.deployed().then(function(instance){
	    console.log(instance.MatryxToken)
      //assert.isTrue(Crowdsale.deployed())
    })
  })
  it("updates the whitelist", function() {
  	var inst
    return Crowdsale.deployed().then(function(instance) {
      inst = instance	
      return instance.updateWhitelist("0x00c1b6f5d5939bd8c71b3c37ce830321c47dbcdb", {from: "0x5194e2ffd3f4bec0157ea1ec572925fdc2e4b740"})
    }).then(function(ret) {
      //console.log(ret)
      return inst.whitelist("0x00c1b6f5d5939bd8c71b3c37ce830321c47dbcdb")
    }).then(function(listed){
      assert.isTrue(listed)
    })
  })
})
