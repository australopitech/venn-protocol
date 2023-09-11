// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC721Metadata.sol";

interface IReceiptNFT is IERC721 {

    function safeMint(address to, string memory uri) external;

    function burn(uint256 tokenId) external;


}