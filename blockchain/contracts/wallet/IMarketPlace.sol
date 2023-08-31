// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.12;

import '../wallet/RWalletFactory.sol';
import '../wallet/RWallet.sol';

interface IMarketPlace {
    
    /**
     *  @dev allows rWallet accounts to rent NFT listed in the Market Place contract
     * 
     *  Words MUST, REQUIRE, SHOULD in accordance RFC-2119 (check https://www.rfc-editor.org/rfc/rfc2119.txt).
     *  
     *  Market Places MUST implement the following function and use it as the outer most method for renting NFT's
     *  in order to be compliant with the rwallet protocol.
     * 
     *  Implementations MUST:
     * 
     *  - REQUIRE caller IS rWallet account. This can be done via `isWallet` method in factory contract.
     *  - REQUIRE caller's OPERATOR COUNT for this contract be ZERO, i.e., caller account CANNOT have ANY operators set for this NFT contract:
     *  this can be done via `getOperatorCount` method in wallet contracts.
     *  
     *  Implementations SHOULD:
     * 
     *  - REQUIRE `duration` is less then or equal to maximum duration especified by NFT owner.
     *  - REQUIRE `msg.value` be enough to cover the rent value and any outstanding service fee.
     * 
     *  Reference can be seen at MarketPlace.sol
     * 
     */
    function rentNFT (address contract_, uint256 tokenId, address nftOwner, uint256 duration) external payable;

}