var BigNumber = require('bignumber.js')
var Crowdsale = artifacts.require("./TestCrowdsale.sol")
var Token = artifacts.require("./MatryxToken")

var inst
var token
var presale
var start
var end
var crowdsaleAddy

// token balances
var a0Balance
var a1Balance
// supply 
var tSupply
var wieSupply
var pt
var tt

// tier one purchase wei
var n1 = new BigNumber(75*Math.pow(10, 18))
// tier two purchase wei
var n2 = new BigNumber(150*Math.pow(10, 18))
// tier three purchase wei
var n3 = new BigNumber(300*Math.pow(10, 18))
// tier whitelistmpurchase wei
var n4 = new BigNumber(20000)
// regular sale purchase wei
var n5 = new BigNumber(1*Math.pow(10, 18))
// presale wei cap
var p = new BigNumber(809015*Math.pow(10, 17))
// sale wei cap
var t = new BigNumber(161803*Math.pow(10, 18))

contract('Crowdsale', function(accounts) {
  // Token Tests
  it("Crowdsale & Token deployed", function() {
    return Crowdsale.deployed().then(function(instance){
      crowdsaleAddy = instance.address
      inst = instance
      return instance.token()
    }).then(function(address){
      Token.at(address).then(function(instance) {
        token = instance;
        return token.totalSupply.call()
      }).then(function(total) {
        // assert totalSupply init to 0
        assert.equal(total, 0, "totalSupply not initilized correctly")
        return token.name.call().then(function(name){
          // assert vanity variable is set
          assert.equal(name, "MatryxToken", "vanity variable not set correctly")
        })
      })
    })
  })
  it("Crowdsale has correct owner", function(){
    return inst.owner.call().then(function(owner){
      assert.equal(owner, accounts[0])
    })
  })
  it("token has correct owner", function(){
    return token.owner.call().then(function(owner){
      // assert token is owned by crowdsale contract
      assert.equal(owner, crowdsaleAddy)
    })
  })
  it("sets the timestamps", function(){
    presale = new Date().getTime() + 1
    start = new Date().getTime() + 2
    end = new Date().getTime() + 3

    return inst.setTime(presale, start, end).then(function(){
      return inst.presaleStartTime.call()
    }).then(function(time) {
      // assert presale 
      assert.equal(time, presale, "presale time not set correctly")
      end = new Date().getTime()
      return inst.setEndsAt(end).then(function(){
        return inst.endTime.call()
      }).then(function(endTime){
        assert.equal(end, endTime, "end time not set correctly")
        // assert only owner can change end time
        var _end = new Date().getTime() + 1337
        return inst.setEndsAt(_end, {from: accounts[1]}).then(function(){
          return inst.endTime.call()
        }).then(function(endTime) {
          assert.equal(end, endTime, "non owner called end time")
        })
      })
    })
  })
  it("updates the presale whitelist", function() {
    var watcher = inst.Whitelisted()
    return inst.updateWhitelist(accounts[1], {from: accounts[0]}).then(function(tx) {
      return watcher.get()
    }).then(function(e){
      assert.equal(e.length, 1);
      assert.isTrue(e[0].args.status)
      assert.equal(e[0].args.addr, accounts[1])
      return inst.whitelist(accounts[1])
    }).then(function(listed){
      assert.isTrue(listed)
    })
  })
  it("test async", async function() {
    var test = await token.totalSupply.call()
    console.log(test)
  })
  it("can't buy before presale time", function() {
    presale = new Date().getTime() + 10000
    presale = Math.floor(presale / 1000)

    return inst.sendTransaction({from: accounts[0], value: 20000}).then(function(res) {
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaiser = 0
        assert.equal(raised.toNumber(), 0, "wei raised is incorrect")
        return token.totalSupply.call().then(function(totalSupply){
          // assert total supply = 0
          assert.equal(totalSupply.toNumber(), 0, "whitelist presale buy not correct")
          return token.balanceOf(accounts[0])
        }).then(function(purchased) {
          // assert total = 0
          assert.equal(purchased.toNumber(), 0, "purchaser balance presale buy not correct")
        })
      })
    })
  })
  it("can't buy presale low value non-whitelist purchase", function() {
    presale = new Date().getTime()
    presale = Math.floor(presale / 1000)
    start = new Date().getTime() + 10000
    start = Math.floor(start / 1000)
    end = new Date().getTime() + 20000
    end = Math.floor(end / 1000)

    return inst.setTime(presale, start, end).then(function() {
      return inst.sendTransaction({from: accounts[0], value: 20000}).then(function(res) {
        return inst.weiRaised.call().then(function(raised) {
          // assert weiRaiser = 0
          assert.equal(raised.toNumber(), 0, "can't presale buy not correct")
        })
      })
    })
  })
  it("halts payments in an emergency", function() {
    presale = new Date().getTime() - 10000000
    presale = Math.floor(presale / 1000)
    start = new Date().getTime() + 10000000
    start = Math.floor(start / 1000)
    end = new Date().getTime() + 20000000
    end = Math.floor(end / 1000)

    return inst.setTime(presale, start, end).then(function() {
      return inst.halt({from: accounts[0]}).then(function(){
        return inst.sendTransaction({from: accounts[1], value: 20000}).then(function(res) {
          return inst.weiRaised.call()
        }).then(function(raised) {
          // assert wei raised is 0
          assert.equal(raised.toNumber(), 0, "halted wei presale purchase did not issue correct amount")
          return inst.unhalt({from: accounts[0]})
        }).then(function(res) {
          return inst.halted.call()
        }).then(function(halted) {
          // assert halted is false now
          assert.equal(halted, false, "could not unhalt crowdsale")
        })
      })
    })
  })
  it("can buy presale whitelist purchase", function() {
    presale = new Date().getTime() - 10000000
    presale = Math.floor(presale / 1000)
    start = new Date().getTime() + 10000000
    start = Math.floor(start / 1000)
    end = new Date().getTime() + 20000000
    end = Math.floor(end / 1000)

    return inst.setTime(presale, start, end).then(function(){
      return inst.sendTransaction({from: accounts[1], value: 20000}).then(function(res) {
        return inst.weiRaised.call()
      }).then(function(raised){
        // assert weiRaised = 20000
        assert.equal(raised.toNumber(), 20000, "whitelist presale purchase did not issue correct amount")
        return token.totalSupply.call().then(function(totalSupply){
          tSupply = totalSupply
          // assert total supply = 20000 * 1397
          assert.equal(totalSupply.toNumber(), 20000*1397, "halted wei presale purchase did not issue correct amount")
          return token.balanceOf(accounts[1])
        }).then(function(purchased) {
          a1Balance = purchased
          // assert total = 20000 * 1397
          assert.equal(purchased.toNumber(), (20000*1397), "20000 wei presale purchase did not issue correct amount")
        })
      })
    })
  })
  it("only owner can mint", function() {
    return token.mint(crowdsaleAddy, 20000, {from: accounts[0]}).then(function(tx) {
      return token.totalSupply.call()
    }).then(function(totalSupply){
      tSupply = totalSupply
      // assert total supply = 20000 * 1397
      assert.equal(totalSupply.toNumber(), 20000*1397, "direct minting purchase did not issue correct amount")
      // assert weiRaised = 20000
    })
  })
  it("can buy presale tier one purchase", function() {
    return inst.sendTransaction({from: accounts[0], value: 75*Math.pow(10, 18)}).then(function(res) {
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaised = 20000 + 75 eth
        assert.equal(raised.toNumber(), 20000 + 75*Math.pow(10, 18), "tier one presale purchase did not issue correct amount")
        return token.totalSupply.call().then(function(totalSupply){
          tSupply = totalSupply
          return token.balanceOf(accounts[0])
        }).then(function(purchased) {
          a0Balance = purchased
          // assert total = 75 eth * 1164 + 20000 wei * 1164
          var sum = a0Balance.plus(a1Balance)
          assert.equal(tSupply.toString(10), sum.toString(10), "75 eth purchase did not issue correct amount")
        })
      })
    })
  })
  it("can buy presale tier two purchase", function() {
    return inst.sendTransaction({from: accounts[0], value: 150*Math.pow(10, 18)}).then(function(res) {
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaised = 20000 + 75 eth + 150 eth
        var s = n1.plus(n2)
        var s = s.plus(n4)
        assert.equal(raised.toString(10), s.toString(10), "tier one presale purchase did not issue correct amount")
        return token.totalSupply.call().then(function(totalSupply){
          // assert total supply = 20000 * 1397 + 75 eth * 1164 + 150 eth * 1281
          tSupply = totalSupply
          return token.balanceOf(accounts[0])
        }).then(function(purchased) {
          // assert total = 75 eth * 1164 + 150 eth * 1281
          a0Balance = purchased
          var sum = a0Balance.plus(new BigNumber(20000*1397))
          assert.equal(tSupply.toString(10), sum.toString(10), "150 eth purchase did not issue correct amount")
        })
      })
    })
  })
  it("can buy presale tier three purchase", function() {
    return inst.sendTransaction({from: accounts[0], value: 300*Math.pow(10, 18)}).then(function(res) {
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaised = 20000 + 75 eth + 150 eth + 300 eth
        var s = n1.plus(n2).plus(n3).plus(n4)
        assert.equal(raised.toString(10), s.toString(10), "tier one presale purchase did not issue correct amount")
        return token.totalSupply.call().then(function(totalSupply){
          tSupply = totalSupply
          return token.balanceOf(accounts[0])
        }).then(function(purchased) {
          // assert total = 75 eth * 1164 + 150 eth * 1281 + 300 eth * 1339
          a0Balance = purchased
          var sum = a0Balance.plus(new BigNumber(20000*1397))
          assert.equal(tSupply.toString(10), sum.toString(10), "150 eth purchase did not issue correct amount")
        })
      })
    })
  })
  it("can buy up to the presale cap", function() {
    return inst.weiRaised.call().then(function(raised) {
      pt = p.minus(raised)
      return inst.sendTransaction({from: accounts[1], value: pt}).then(function(tx) {
        return inst.weiRaised.call().then(function(raised) {
          assert(raised.toString(10), p.toString(10))
          return token.balanceOf(accounts[1]).then(function(bal) {
            assert(bal, new BigNumber(20000*1397).plus(pt.mul(1397)))
          })
        })
      })
    })
  })
  it("can't buy if presale cap is reached", function() {
    var events = inst.allEvents();
    return inst.sendTransaction({from: accounts[0], value: 1}).then(function(res) {
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaised = presale total
        assert.equal(raised.toString(10), p.toString(10), "presale cap reached purchase did not issue correct amount")
        return token.totalSupply.call().then(function(totalSupply){
          tSupply = totalSupply
          return token.balanceOf(accounts[0])
        }).then(function(purchased) {
          // assert total = 75 eth * 1164 + 150 eth * 1281 + 300 eth * 1339
          var amount = web3.fromWei(purchased.toNumber())
          assert.equal(amount, (75*1164)+(150*1281)+(300*1339), "over cap eth purchase did not issue correct amount")
          var test = pt
          test = test.mul(1397)
          test = test.plus(n1.mul(1164)).plus(n2.mul(1281)).plus(n3.mul(1339)).plus(n4.mul(1397))
          // assert total tokens = 75 eth * 1164 + 150 eth * 1281 + 300 eth * 1339 + remaining wei * 1397
          assert.equal(tSupply.toString(10), test.toString(10), "totalSupply incorrect")
        })
      })
    })
  })
  it("can buy regular sale purchase", function() {
    presale = new Date().getTime() - 10000000
    presale = Math.floor(presale / 1000)
    start = new Date().getTime()
    start = Math.floor(start / 1000)
    end = new Date().getTime() + 20000000
    end = Math.floor(end / 1000)

    return inst.setTime(presale, start, end).then(function(){
      return inst.sendTransaction({from: accounts[0], value: 1*Math.pow(10, 18)}).then(function(res) {
        return inst.weiRaised.call().then(function(raised){
        // assert weiRaised = 20000 + 75 eth + 150 eth + 300 eth + 1 eth + presale cap difference
          var s = n1.plus(n2).plus(n3).plus(n4).plus(n5).plus(pt)
          assert.equal(raised.toString(10), s.toString(10), "presale cap reached purchase did not issue correct amount")
          return token.totalSupply.call().then(function(totalSupply){
            tSupply = totalSupply
            return token.balanceOf(accounts[0])
          }).then(function(purchased) {
            // assert total = 50 eth * 2164 + 100 eth * 3164
            var amount = web3.fromWei(purchased.toNumber())
            assert.equal(amount, (75*1164)+(150*1281)+(300*1339)+1164, "1 eth purchase did not issue correct amount")
          })
        })
      })
    })
  })
  it("can buy up to the sale cap", function() {
    return inst.weiRaised.call().then(function(raised) {
      tt = t.minus(raised)
      return inst.sendTransaction({from: accounts[1], value: tt}).then(function(tx) {
        return inst.weiRaised.call().then(function(raised) {
          assert(raised.toString(10), t.toString(10))
          return token.balanceOf(accounts[1]).then(function(bal) {
            assert(bal, new BigNumber(20000*1397).plus(tt.mul(1164)).plus(pt.mul(1397)))
          })
        })
      })
    })
  })
  it("can't buy if sale cap is reached", function() {
    return inst.sendTransaction({from: accounts[0], value: 1}).then(function(res) {
      return inst.weiRaised.call().then(function(raised){
        // assert weiRaised = 20000 + 75 eth + 150 eth + 300 eth + 1 eth + presale cap difference + sale cap
        var s = n1.plus(n2).plus(n3).plus(n4).plus(n5).plus(pt).plus(tt)
        assert.equal(raised.toString(10), s.toString(10), "sale cap reached purchase did not issue correct amount") 
        return token.totalSupply.call().then(function(totalSupply){
          tSupply = totalSupply
          return token.balanceOf(accounts[0])
        }).then(function(purchased) {
          // assert total = 50 eth * 2164 + 100 eth * 3164
          var amount = web3.fromWei(purchased.toNumber())
          assert.equal(amount, (75*1164)+(150*1281)+(300*1339)+1164, "over cap eth purchase did not issue correct amount")
        })
      })
    })
  })
  it("can't buy after sale end time", function() {
    end = new Date().getTime()
    end = Math.floor(end / 1000)

    return inst.setTime(presale, start, end).then(function() {
      return inst.sendTransaction({from: accounts[0], value: 20000}).then(function(res) {
        return inst.weiRaised.call().then(function(raised) {
          // assert weiRaised = 20000 + 75 eth + 150 eth + 300 eth + 1 eth + presale cap difference + sale cap
          var s = n1.plus(n2).plus(n3).plus(n4).plus(n5).plus(pt).plus(tt)
          assert.equal(raised.toString(10), s.toString(10), "presale cap reached purchase did not issue correct amount")         
          return token.balanceOf(accounts[0])
        }).then(function(purchased) {
          var amount = web3.fromWei(purchased.toNumber())
          assert.equal(amount, (75*1164)+(150*1281)+(300*1339)+1164, "after time end did not issue correct amount")
        })
      })
    })
  })
  it("owner can finalize", function() {
    return inst.finalize({from: accounts[0]}).then(function(res) {
      return inst.isFinalized.call()
    }).then(function(final) {
      assert.equal(final, true, "Finalized was not set to true when called")
      return token.totalSupply.call()
    }).then(function(total) {
      // assert final supply equals pi
      assert.equal(web3.fromWei(total.toNumber()), 314159265, "Finalize did not issue correct tokens")
      return token.mintingFinished.call()
    }).then(function(doneMinting) {
      assert.equal(doneMinting, true, "finished minting was not set correctly")
      return token.owner.call()
    }).then(function(owner) {
      // assert that the token is now owned by master account
      assert.equal(owner, accounts[0], "ownership was not transferred correctly")
      return token.balanceOf(accounts[0])
    }).then(function(bal) {
      // assert that the owner remaining ~40% of tokens were issued in finalization.
      assert(web3.fromWei(bal.toNumber()), 107705112.5)
    })
  })

})
