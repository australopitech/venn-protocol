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

    // NFT[] private _assets;
    mapping(address => NFT[]) _assetsByOwner;

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
        // NFT memory dummyAsset = NFT(
        //     0,
        //     address(this),
        //     address(this),
        //     0,
        //     0,
        //     0
        // );
        // _assets.push(dummyAsset);
    }

    // function getAssets() public view returns(NFT[] memory) {
    //     return _assets;
    // }

    function getAssetsByOwner(address nftOwner) public view returns(NFT[] memory) {
        return _assetsByOwner[nftOwner];
    }

    function getBalance(address account) public view returns(uint256) {
        return _balances[account];
    }

    function isWallet(address account) public view returns(bool) {
        return factoryContract.isWallet(account);
    }

    function listNFT(address contract_, uint256 tokenId, uint256 price, uint256 maxDuration) public {
        require(_isApproved(contract_, tokenId), "Operator not approved");
        require(msg.sender == _getNFTowner(contract_, tokenId), "caller is not NFT owner");
        
        uint256 index;
        uint256 len = _assetsByOwner[msg.sender].length;
        if(len < 1) {
            /* index 0 is a filler-object */
            _assetsByOwner[msg.sender].push(_dummyAsset());
            index = 1;
        } else index = len;
 
        NFT memory newAsset = NFT(
            index,
            msg.sender,
            contract_,
            tokenId,
            price,
            maxDuration
        );
        // _assets.push(newAsset);
        // _tokenIndex[contract_][tokenId] = index;
        _assetsByOwner[msg.sender].push(newAsset);
        IERC721 nftContract = IERC721(contract_);
        nftContract.transferFrom(msg.sender, address(this), tokenId);
        emit Listing(msg.sender, contract_, tokenId);
    }

    function rentNFT (
        address contract_, uint256 tokenId, address nftOwner, uint256 duration
    ) external payable override {
        require(isWallet(msg.sender), "caller is not a renter wallet contract");
        require(_operatorCount(msg.sender, contract_) <= 0, "error: operator count greater than zero" );
        require(_isApproved(contract_, tokenId), "error: token approval was revoked");
        uint256 index = _tokenIndex[contract_][tokenId];
        /* index 0 is always a filler object in the list and uninitiated in mapping */
        require(_assetsByOwner[nftOwner].length > 0, "NFT not listed");
        require(duration <= _assetsByOwner[nftOwner][index].maxDuration, "loan period set too long");
        uint256 rent = _assetsByOwner[nftOwner][index].price * duration;
        uint256 serviceFee = (rent * feeMultiplier) / feeBase;
        require(msg.value >= rent + serviceFee, "not enough funds");
        
        _balances[nftOwner] += rent;
        treasury += serviceFee;
        _removeListing(nftOwner, index);
        IERC721 nftContract = IERC721(contract_);
        nftContract.transferFrom(address(this), msg.sender, tokenId);
        emit Rental(nftOwner, msg.sender, contract_, tokenId);
    }

    function deList(uint256 index) external {
        _removeListing(msg.sender, index);
    }

    function _removeListing(address nftOwner, uint256 index) private {
        //ver o que acontece se chamar .pop() numa lista vazia
        if(_assetsByOwner[nftOwner].length < 2) revert EmptyList();
        if(_assetsByOwner[nftOwner].length < 3) _assetsByOwner[nftOwner].pop();

        uint256 lastIndex = _assetsByOwner[nftOwner].length - 1;
        _assetsByOwner[nftOwner][index] = _assetsByOwner[nftOwner][lastIndex];
        _assetsByOwner[nftOwner][index].index = index;
        _tokenIndex[_assetsByOwner[nftOwner][index].contract_][_assetsByOwner[nftOwner][index].id] = index;
        _assetsByOwner[nftOwner].pop();
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

    function _dummyAsset() private pure returns(NFT memory) {
        return NFT (
            0,
            address(0),
            address(0),
            0,
            0,
            0
        );
    }

}