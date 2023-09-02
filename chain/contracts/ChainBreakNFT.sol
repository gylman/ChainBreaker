// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract ChainBreakNFT is ERC721 {
    address private _owner;
    uint public totalSupply;

    constructor() ERC721("ChainBreaker", "CBNFT") {
        _owner = msg.sender;
    }

    function mint(address _to) external {
        require (_owner == msg.sender);

        totalSupply += 1;
        _mint(_to, totalSupply);
    }
}
