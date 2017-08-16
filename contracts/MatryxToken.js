pragma solidity ^0.4.11;

import "./MintableToken.sol";


/**
 * Matryx Ethereum token.
 */
contract MatryxToken is MintableToken {

  string public name;
  string public symbol;
  uint public decimals;
  address public foundation;

  function MatryxToken(address _owner, string _name, string _symbol, uint _totalSupply, uint _decimals) {
    name = _name;
    symbol = _symbol;
    totalSupply = _totalSupply;
    decimals = _decimals;
    foundation = _owner;
  }
}