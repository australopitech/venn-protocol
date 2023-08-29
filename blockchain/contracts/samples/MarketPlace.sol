// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.12;

import '../wallet/RWalletFactory.sol';
import '../wallet/RWallet.sol';
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MarketPlace {

    RWalletFactory public immutable factoryContract;

    uint256 public treasury;

    uint256 public feeBase;

    uint256 public feeMultiplier;

    struct NFT {
        bool available;
        address lender;
        address contract_;
        uint256 id;
        uint256 fee;
        uint256 maxDuration;
    }

    mapping (address => NFT[]) private _assets;

    mapping(address => uint256) private _balances;

    event Loan(
        address indexed lender,
        address indexed borrower,
        address indexed nftContract,
        uint256 tokenId
    );

    constructor(
        address factoryAddress,
        uint256 _feeBase,
        uint256 _feeMultiplier
        ) {
        factoryContract = RWalletFactory(factoryAddress);
        feeBase = _feeBase;
        feeMultiplier = _feeMultiplier;
    }

    function getAssets(address lender) public view returns(NFT[] memory) {
        return _assets[lender];
    }

    function getBalance(address account) public view returns(uint256) {
        return _balances[account];
    }

    function isWallet(address account) public view returns(bool) {
        return factoryContract.isWallet(account);
    }

    function lendNFT(address contract_, uint256 tokenId, uint256 fee, uint256 maxDuration) public {
        require(_isApproved(contract_, tokenId), "Operator not approved");
        require(msg.sender == _getNFTowner(contract_, tokenId), "caller is not NFT owner");
        NFT memory newAsset = NFT(
            true,
            msg.sender,
            contract_,
            tokenId,
            fee,
            maxDuration
        );
        _assets[msg.sender].push(newAsset);
    }

    function borrowNFT(address lender, uint256 index, uint256 duration) public payable {
        require(isWallet(msg.sender), "caller is not a renter wallet contract");
        uint256 _maxDuration = _assets[lender][index].maxDuration;
        require(duration <= _maxDuration, "loan period set too long");
        uint256 fee = _assets[lender][index].fee;
        uint256 serviceFee = (fee * duration * feeMultiplier) / feeBase;
        require(msg.value >= (fee *duration)+ serviceFee, "not enough funds");
        uint256 tokenId = _assets[lender][index].id;
        address contract_ = _assets[lender][index].contract_;
        require(_operatorCount(msg.sender, contract_) <= 0, "error: operator count greater than zero" );
        require(_isApproved(contract_, tokenId), "error: token approval was revoked");

        _balances[lender] += fee * duration;
        treasury += serviceFee;
        IERC721 nftContract = IERC721(contract_);
        RWallet wallet = RWallet(payable(msg.sender));
        wallet.uponNFTLoan(
            address(nftContract),
            tokenId,
            lender,
            duration
        );
        _assets[lender][index].available = false;
        nftContract.transferFrom(lender, msg.sender, tokenId);
        emit Loan(lender, msg.sender, contract_, tokenId);
    }

    function withdraw() public {
        uint256 bal = _balances[msg.sender];
        require( bal > 0, "there is no balance for caller address");
        _balances[msg.sender] = 0;

        (bool success,) = payable(msg.sender).call{value: bal}("");
        require(success, "transfer of funds failed");
    }
    
    // CHANGE TO PRIVATE
    function _isApproved(address contract_, uint256 tokenId) public view returns(bool) {
        IERC721 nftContract = IERC721(contract_);
        address owner = nftContract.ownerOf(tokenId);
        return (
            nftContract.getApproved(tokenId) == address(this) ||
            nftContract.isApprovedForAll( owner , address(this) )
        );
    }

    function _operatorCount(address wallet, address contract_) public view returns(uint256) {
        RWallet _wallet = RWallet(payable(wallet));
        return _wallet.getOperatorCount(contract_);
    }

    function _getNFTowner(address contract_, uint256 tokenId) private view returns(address) {
        IERC721 nftContract = IERC721(contract_);
        return nftContract.ownerOf(tokenId);
    }

}