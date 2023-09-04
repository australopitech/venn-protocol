// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.12;

import './IMarketPlace.sol';
import './RWalletFactory.sol';
import './RWallet.sol';
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MarketPlace is IMarketPlace {

    RWalletFactory public immutable factoryContract;

    uint256 public treasury;

    uint256 public feeBase;

    uint256 public feeMultiplier;

    struct NFT {
        uint256 index;
        address nftOwner;
        address contract_;
        uint256 id;
        uint256 price;
        uint256 maxDuration;
    }

    NFT[] private _assets;

    mapping(address => mapping(uint256 => uint256)) private _tokenIndex;

    // mapping (address => NFT[]) private _assetsByOwner;

    mapping(address => uint256) private _balances;

    event Listing (
        address indexed nftOwner,
        address indexed nftContract,
        uint256 tokenId
    );

    event Delisting (
        address indexed contract_,
        uint256 tokenId
    );
    
    event Rental (
        address indexed nftOwner,
        address indexed rentee,
        address indexed nftContract,
        uint256 tokenId
    );

    error EmptyList();

    constructor(
        address factoryAddress,
        uint256 _feeBase,
        uint256 _feeMultiplier
        ) {
        factoryContract = RWalletFactory(factoryAddress);
        feeBase = _feeBase;
        feeMultiplier = _feeMultiplier;
        NFT memory dummyAsset = NFT(
            0,
            address(this),
            address(this),
            0,
            0,
            0
        );
        _assets.push(dummyAsset);
    }

    function getAssets() public view returns(NFT[] memory) {
        return _assets;
    }

    // function getAssetsByOwner(address nftOwner) public view returns(NFT[] memory) {
    //     return _assetsByOwner[nftOwner];
    // }

    function getBalance(address account) public view returns(uint256) {
        return _balances[account];
    }

    function isWallet(address account) public view returns(bool) {
        return factoryContract.isWallet(account);
    }

    function listNFT(address contract_, uint256 tokenId, uint256 price, uint256 maxDuration) public {
        require(_isApproved(contract_, tokenId), "Operator not approved");
        require(msg.sender == _getNFTowner(contract_, tokenId), "caller is not NFT owner");
        uint256 index = _assets.length;
        NFT memory newAsset = NFT(
            index,
            msg.sender,
            contract_,
            tokenId,
            price,
            maxDuration
        );
        _assets.push(newAsset);
        _tokenIndex[contract_][tokenId] = index;
        // _assetsByOwner[msg.sender].push(newAsset);
        emit Listing(msg.sender, contract_, tokenId);
    }

    function rentNFT (
        address contract_, uint256 tokenId, address nftOwner, uint256 duration
    ) external payable override {
        require(isWallet(msg.sender), "caller is not a renter wallet contract");
        uint256 index = _tokenIndex[contract_][tokenId];
        require(index > 0, "NFT not listed");
        require(duration <= _assets[index].maxDuration, "loan period set too long");
        uint256 price = _assets[index].price;
        uint256 serviceFee = (price * duration * feeMultiplier) / feeBase;
        require(msg.value >= (price * duration) + serviceFee, "not enough funds");
        require(_operatorCount(msg.sender, contract_) <= 0, "error: operator count greater than zero" );
        require(_isApproved(contract_, tokenId), "error: token approval was revoked");
        
        _balances[nftOwner] += price * duration;
        treasury += serviceFee;
        IERC721 nftContract = IERC721(contract_);
        _removeListing(index);
        nftContract.transferFrom(nftOwner, msg.sender, tokenId);
        emit Rental(nftOwner, msg.sender, contract_, tokenId);
    }

    function deList(uint256 index) external {
        require(msg.sender == _assets[index].nftOwner, "only the owner can de-list");
        _removeListing(index);
    }

    function _removeListing(uint256 index) private {
        if(_assets.length < 2) revert EmptyList();

        uint256 lastIndex = _assets.length - 1;
        _assets[index] = _assets[lastIndex];
        _assets[index].index = index;
        _tokenIndex[_assets[index].contract_][_assets[index].id] = index;
        _assets.pop();
    }

    function withdraw() public {
        uint256 bal = _balances[msg.sender];
        require( bal > 0, "there is no balance for caller address");
        _balances[msg.sender] = 0;

        (bool success,) = payable(msg.sender).call{value: bal}("");
        require(success, "transfer of funds failed");
    }
    
    function _isApproved(address contract_, uint256 tokenId) private view returns(bool) {
        IERC721 nftContract = IERC721(contract_);
        address owner = nftContract.ownerOf(tokenId);
        return (
            nftContract.getApproved(tokenId) == address(this) ||
            nftContract.isApprovedForAll( owner , address(this) )
        );
    }

    function _operatorCount(address wallet, address contract_) private view returns(uint256) {
        RWallet _wallet = RWallet(payable(wallet));
        return _wallet.getOperatorCount(contract_);
    }

    function _getNFTowner(address contract_, uint256 tokenId) private view returns(address) {
        IERC721 nftContract = IERC721(contract_);
        return nftContract.ownerOf(tokenId);
    }

}