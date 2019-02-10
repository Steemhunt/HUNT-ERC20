pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";

contract HuntToken is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {
  uint private INITIAL_SUPPLY = 500000000e18;

  constructor () public
    ERC20Burnable()
    ERC20Mintable()
    ERC20Detailed("HuntToken", "HUNT", 18)
  {
    _mint(msg.sender, INITIAL_SUPPLY);
  }
}
