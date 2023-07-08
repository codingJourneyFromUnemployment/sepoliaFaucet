//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import 'hardhat/console.sol';

contract Game1 {
  event Winner(address winner);

  function win() public {
    console.log('Winner is %s', msg.sender);
    emit Winner(msg.sender);
  }
}