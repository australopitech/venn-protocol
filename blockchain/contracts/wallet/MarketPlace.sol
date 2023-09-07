// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.12;

import './IMarketPlace.sol';
import './IReceiptNFT.sol';
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
/* implementar a interface */
import './RWalletFactory.sol';
import './RWallet.sol';

/* TODO:
- Implentar a inteface da wallet e da factory

- implementar a taxa mev
    - variavel publica pullFee
    - mapping receipt => pullFee (atualizado na rentNFT calculado em cima do valor rent)
    - metodo admin pra ajustar as fees

*/

contract MarketPlace is IMarketPlace {

    error NoReceipts(address, uint256);

    RWalletFactory public immutable factoryContract;

    IReceiptNFT public immutable receiptsContract;

    uint256 public treasury;

    uint32 public feeBase;

    uint16 public feeMultiplier;

    uint32 public pullFeeBase;

    uint16 public pullFeeMultiplier;

    address public admin;
    
    /* maps NFT to listed price */
    mapping(address => mapping(uint256 => uint256)) private _prices;

    /* maps NFT to maximum rent duration */
    mapping(address => mapping(uint256 => uint256)) private _maxDuration;
    
    /* maps NFT to receiptId */
    mapping(address => mapping(uint256 => uint256)) private _receipts;

    /* maps receiptId to rent expiration timestamp */ 
    mapping(uint256 => uint256) private _expiration;

    /* maps receiptIt to pull fee
       pull fee is paid to the caller of `pullAsset` wich is permissionless 
    */
    mapping(uint256 => uint256) private _pullFee;

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

    modifier onlyAdmin {
        require(msg.sender == admin, "only admin");
        _;
    }

    constructor(
        address factoryAddress,
        address receiptsContractAddr,
        uint32 _feeBase,
        uint16 _feeMultiplier,
        uint32 _pullFeeBase,
        uint16 _pullFeeMultiplier,
        address _admin
        ) {
        factoryContract = RWalletFactory(factoryAddress);
        receiptsContract = IReceiptNFT(receiptsContractAddr);
        feeBase = _feeBase;
        feeMultiplier = _feeMultiplier;
        pullFeeBase = _pullFeeBase;
        pullFeeMultiplier = _pullFeeMultiplier;
        admin = _admin;
    }

    // function getAssets() public view returns(NFT[] memory) {
    //     return _assets;
    // }

    // function getAssetsByOwner(address nftOwner) public view returns(NFT[] memory) {
    //     return _assetsByOwner[nftOwner];
    // }


    function getPrice(address contract_, uint256 tokenId) external view returns(uint256) {
        return _prices[contract_][tokenId];
    }

    function getMaxDuration(address contract_, uint256 tokenId) external view returns(uint256) {
        return _maxDuration[contract_][tokenId];
    }

    function getReceipt(address contract_, uint256 tokenId ) external view returns(uint256) {
        return _receipts[contract_][tokenId];
    }

    function getPullFee(uint256 receiptId) external view returns(uint256) {
        return _pullFee[receiptId];
    }

    // function getExpiration(uint256 receiptId) external view returns(uint256) {
    //     return _expiration[receiptId];
    // }

    function getBalance(address account) external view returns(uint256) {
        return _balances[account];
    }

    function isWallet(address account) public view returns(bool) {
        return factoryContract.isWallet(account);
    }

    function setMaxDuration(address contract_, uint256 tokenId, uint256 maxDuration) external {
        require(
            receiptsContract.ownerOf( _receipts[contract_][tokenId] ) == msg.sender,
            "error: token not listed or caller not owner of receipt-token"
        );
        _maxDuration[contract_][tokenId] = maxDuration;
    }

    function setPrice(address contract_, uint256 tokenId, uint256 price) external {
        require(
            receiptsContract.ownerOf( _receipts[contract_][tokenId] ) == msg.sender,
            "error: token not listed or caller not owner of receipt-token"
        );
        _prices[contract_][tokenId] = price;
    }



    function listNFT(address contract_, uint256 tokenId, uint256 price, uint256 maxDuration) public {
        require(_isApproved(contract_, tokenId), "Operator not approved");
        require(msg.sender == _getNFTowner(contract_, tokenId), "caller is not NFT owner");
        
        IERC721Metadata nftContract = IERC721Metadata(contract_);
        nftContract.transferFrom(msg.sender, address(this), tokenId);
        string memory uri = nftContract.tokenURI(tokenId);

        _prices[contract_][tokenId] = price;
        _maxDuration[contract_][tokenId] = maxDuration;

        (bool success, bytes memory data) = address(receiptsContract).call(
            abi.encodeWithSignature("mint(address,string)", msg.sender, uri )
        );
        require(success, "receipt mint failed");

        _receipts[contract_][tokenId] = abi.decode(data, (uint256));
        emit Listing(msg.sender, contract_, tokenId);
    }

    function rentNFT (
        address contract_, uint256 tokenId, uint256 duration
    ) external payable override {
        require(isWallet(msg.sender), "caller is not a renter wallet contract");
        require(_operatorCount(msg.sender, contract_) <= 0, "error: operator count greater than zero" );
        require(_maxDuration[contract_][tokenId] > 0, "this NFT is not listed");
        require(duration <= _maxDuration[contract_][tokenId], "rental period set too long");
        uint256 rent = _prices[contract_][tokenId] * duration;
        uint256 serviceFee = (rent * feeMultiplier) / feeBase;
        require(msg.value >= rent + serviceFee, "not enough funds");
        
        uint256 receiptId = _receipts[contract_][tokenId];
        _expiration[receiptId] = block.timestamp + duration;
        uint256 pullFee =  (serviceFee * pullFeeMultiplier) / pullFeeBase;
        _pullFee[receiptId] = pullFee;

        address nftOwner = receiptsContract.ownerOf(receiptId);
        _balances[nftOwner] += rent;
        treasury += (serviceFee - pullFee) ;
    
        IERC721Metadata nftContract = IERC721Metadata(contract_);
        nftContract.transferFrom(address(this), msg.sender, tokenId);
        emit Rental(nftOwner, msg.sender, contract_, tokenId);
    }

    function deList(address contract_, uint256 tokenId) external {
        uint256 receiptId = _receipts[contract_][tokenId];
        require(msg.sender == _getNFTowner(address(receiptsContract), receiptId), "only owner of receipt");
        _removeListing(contract_, tokenId );
        emit Delisting(contract_, tokenId);

        address owner = _getNFTowner(contract_, tokenId);
        if(owner ==  address(this)) { /* not rented out */
            // _expiration[receiptId] = 0;
            _release(contract_, tokenId, msg.sender);
            return;    
        }
        if(_expiration[receiptId] <= block.timestamp) {
            pullAsset(contract_, tokenId);
            // _release(contract_, tokenId, msg.sender);
        }
        
    }

    // METODO MEV:
    function pullAsset(address contract_, uint256 tokenId) public {
        uint256 receiptId = _receipts[contract_][tokenId];
        if( receiptId <= 0 )
          revert NoReceipts(contract_, tokenId);
        
        _expiration[receiptId] = 0;
        IERC721 nftContract = IERC721(contract_);
        address from = nftContract.ownerOf(tokenId);
        RWallet rwallet = RWallet(payable(from));
        rwallet.pullAsset(rwallet.getTokenIndex(contract_, tokenId));

        if(_maxDuration[contract_][tokenId] == 0) { /* was de-listed */
          address to = receiptsContract.ownerOf(receiptId);
          _release(contract_, tokenId, to);
        }

        (bool success, ) = payable(msg.sender).call{value: _pullFee[ receiptId]}("");
        require(success, "failed transfer of funds");
    }


    function _removeListing(address contract_, uint256 tokenId) private {
        _prices[contract_][tokenId] = 0;
        _maxDuration[contract_][tokenId] = 0;
    }

    function _release(address contract_, uint256 tokenId, address to) private {
        receiptsContract.burn(_receipts[contract_][tokenId]);
        _receipts[contract_][tokenId] = 0;
        IERC721Metadata nftContract = IERC721Metadata(contract_);
        nftContract.transferFrom(address(this), to, tokenId);
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

    /* only admin */
    function withdrawTreasury(uint256 value) external onlyAdmin {
        (bool success, ) = payable(msg.sender).call{value: value}("");
        require(success, "transfer failed ");
    }

    function setServiceFee(uint32 _feeBase, uint16 _feeMultiplier) external onlyAdmin {
        feeBase = _feeBase;
        feeMultiplier = _feeMultiplier;
    }

    function setPullFee(uint32 _feeBase, uint16 _feeMultipler) external onlyAdmin {
        pullFeeBase = _feeBase;
        pullFeeMultiplier = _feeMultipler;
    }

}