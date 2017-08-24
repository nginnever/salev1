var CrowdSale = artifacts.require("./CrowdSale.sol")

contract('CrowdSale', function(crowd) {
  it("should assert true", function(done) {
    var crowd = crowd.deployed()
    assert.isTrue(true)
    console.log(crowd)
    done()
  })
})
