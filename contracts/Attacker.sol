//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./EmitWinner.sol";

contract Attacker {
    EmitWinner public emitWinner;
    constructor (address _emitWinner) {
        emitWinner = EmitWinner(_emitWinner);
    }

    function attack() external {
        emitWinner.attempt();
    }
}