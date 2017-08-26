var Crowdsale = artifacts.require("./TestCrowdsale.sol")
var Token = artifacts.require("./MatryxToken")

var inst
var token
console.log("===")
console.log(new Date().getTime())

contract('Presale', function(accounts) {
  // Token Tests
  it("Crowdsale & Token deployed", function() {
    return Crowdsale.deployed().then(function(instance){
      inst = instance
      return instance.token()
    }).then(function(address){
      // assert address exists
      console.log(address)
      Token.at(address).then(function(instance) {
        token = instance;
        return token.totalSupply.call()
      }).then(function(total) {
        console.log(total.toNumber())
        // assert totalSupply init to 0
        return token.name.call().then(function(name){
          // assert vanity variable is set
          console.log(name)
        })
      })
    })
  })

  // CrowdSale Tests
  it("updates the presale whitelist", function() {
    return Crowdsale.deployed().then(function(instance) {
      inst = instance	
      return instance.updateWhitelist(accounts[1], {from: accounts[0]})
    }).then(function(tx) {
      //console.log(ret)
      return inst.whitelist(accounts[1])
    }).then(function(listed){
      assert.isTrue(listed)
    })
  })
  it("halts payments in an emergency", function() {
    return inst.halt({from: accounts[0]})
    // return Crowdsale.deployed().then(function(instance) {
    //   inst = instance 
    //   return instance.updateWhitelist(accounts[1], {from: accounts[0]})
    // }).then(function(tx) {
    //   //console.log(ret)
    //   return inst.whitelist(accounts[1])
    // }).then(function(listed){
    //   assert.isTrue(listed)
    // })
  })
  it("can't buy before presale time", function() {
    return inst.sendTransaction({from: accounts[0], value: 20000}).then(function(res) {
      //console.log(res)
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaiser = 0
        console.log(raised.toNumber())
        // assert balance returned to purchaser
        console.log(web3.eth.getBalance(accounts[0]).toNumber())
        console.log(web3.eth.getBalance(accounts[1]).toNumber())
        return token.totalSupply.call().then(function(totalSupply){
          // assert total supply = 20000 * 4164
          console.log("-totalSupply-")
          console.log(totalSupply.toNumber())
          return token.balanceOf(accounts[0])
        }).then(function(purchased) {
          // assert total = 20000 * 4164
          console.log("-tokens purchased")
          console.log(purchased.toNumber())
        })
      })
    })
  })
  it("can't buy presale low value non-whitelist purchase", function() {
    return inst.sendTransaction({from: accounts[0], value: 20000}).then(function(res) {
      //console.log(res)
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaiser = 0
        console.log(raised.toNumber())
        // assert balance returned to purchaser
        console.log(web3.eth.getBalance(accounts[0]).toNumber())
        console.log(web3.eth.getBalance(accounts[1]).toNumber())
      })
    })
  })
  it("can buy presale whitelist purchase", function() {
    return inst.sendTransaction({from: accounts[1], value: 20000}).then(function(res) {
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaised = 20000
        console.log(raised.toNumber())
        return token.totalSupply.call().then(function(totalSupply){
          // assert total supply = 20000 * 4164
          console.log(totalSupply.toNumber())
          return token.balanceOf(accounts[1])
        }).then(function(purchased) {
          // assert total = 20000 * 4164
          console.log(purchased.toNumber())
        })
      })
    })
  })
  it("can buy presale tier one purchase", function() {
    return inst.sendTransaction({from: accounts[0], value: 50000000000000000000}).then(function(res) {
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaised = 20000 + 50 eth
        console.log(raised.toNumber())
        return token.totalSupply.call().then(function(totalSupply){
          // assert total supply = 20000 * 4164 + 50 eth * 2164
          console.log(web3.fromWei(totalSupply.toNumber()))
          return token.balanceOf(accounts[0])
        }).then(function(purchased) {
          // assert total = 50 eth * 2164
          var amount = web3.fromWei(purchased.toNumber())
          assert.equal(amount, (50*2164), "50 eth purchase did not issue correct amount")
          console.log(web3.fromWei(purchased.toNumber()))
        })
      })
    })
  })
  it("can buy presale tier two purchase", function() {
    return inst.sendTransaction({from: accounts[0], value: 100000000000000000000}).then(function(res) {
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaised = 20000 + 50 eth + 100 eth
        console.log(raised.toNumber())
        return token.totalSupply.call().then(function(totalSupply){
          // assert total supply = 20000 * 4164 + 50 eth * 2164 + 100 eth * 3164
          console.log(web3.fromWei(totalSupply.toNumber()))
          return token.balanceOf(accounts[0])
        }).then(function(purchased) {
          // assert total = 50 eth * 2164 + 100 eth * 3164
          var amount = web3.fromWei(purchased.toNumber())
          assert.equal(amount, (50*2164)+(100*3164), "100 eth purchase did not issue correct amount")
          console.log(web3.fromWei(purchased.toNumber()))
        })
      })
    })
  })

})
