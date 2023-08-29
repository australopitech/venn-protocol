// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "../samples/MarketPlace.sol";
import "../core/BaseAccount.sol";
import "../samples/callback/TokenCallbackHandler.sol";

/**
  * minimal account.
  *  this is sample minimal account.
  *  has execute, eth handling methods
  *  has a single signer that can send requests through the entryPoint.
  */
contract RWallet is BaseAccount, TokenCallbackHandler, UUPSUpgradeable, Initializable {
    using ECDSA for bytes32;

    address public owner;

    bytes4 private constant TRANSFER_SEL = bytes4(keccak256(bytes("transferFrom(address,address,uint256)")));

    bytes4 private constant SAFE_TRANSFER_SEL = bytes4(keccak256(bytes("safeTransferFrom(address,address,uint256)")));

    bytes4 private constant SAFE_TRANSFER_DATA_SEL = bytes4(keccak256(bytes("safeTransferFrom(address,address,uint256,bytes)")));

    bytes4 private constant APPROVE_SEL = bytes4(keccak256(bytes("approve(address,uint256)")));

    bytes4 private constant APPROVE_ALL_SEL = bytes4(keccak256(bytes("setApprovalForAll(address,bool)")));
    
    bytes private constant EMPTY = bytes("");
    
    IEntryPoint private immutable _entryPoint;

    struct NFT {
        address contract_;
        uint256 id;
        address lender;
        bool borrowed;
        uint256 startTime;
        uint256 endTime;
    }

    event SimpleAccountInitialized(IEntryPoint indexed entryPoint, address indexed owner);

    NFT[] private _loans;

    mapping(address =>  NFT[]) private _loansByContract;

    mapping(address => uint256) private _operatorCount;

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }


    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    constructor(IEntryPoint anEntryPoint) {
        _entryPoint = anEntryPoint;
        _disableInitializers();
    }

    function _onlyOwner() internal view {
        //directly from EOA owner, or through the account itself (which gets redirected through execute())
        require(msg.sender == owner || msg.sender == address(this), "only owner");
    }

    /**
     * execute a transaction (called directly from owner, or by entryPoint)
     */
    function execute(address dest, uint256 value, bytes calldata func) external {
        _requireFromEntryPointOrOwner();
        _call(dest, value, func);
    }

    /**
     * execute a sequence of transactions
     */
    function executeBatch(address[] calldata dest, bytes[] calldata func) external {
        _requireFromEntryPointOrOwner();
        require(dest.length == func.length, "wrong array lengths");
        for (uint256 i = 0; i < dest.length; i++) {
            _call(dest[i], 0, func[i]);
        }
    }

    /**
     * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint,
     * a new implementation of SimpleAccount must be deployed with the new EntryPoint address, then upgrading
      * the implementation by calling `upgradeTo()`
     */
    function initialize(address anOwner) public virtual initializer {
        _initialize(anOwner);
    }

    function _initialize(address anOwner) internal virtual {
        owner = anOwner;
        emit SimpleAccountInitialized(_entryPoint, owner);
    }

    // Require the function call went through EntryPoint or owner
    function _requireFromEntryPointOrOwner() internal view {
        require(msg.sender == address(entryPoint()) || msg.sender == owner, "account: not Owner or EntryPoint");
    }

    /// implement template method of BaseAccount
    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
    internal override virtual returns (uint256 validationData) {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        if (owner != hash.recover(userOp.signature))
            return SIG_VALIDATION_FAILED;
        return 0;
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        require(_beforeCallCheck(target, data), "Unauthorized operation");
        (bool success, bytes memory result) = target.call{value : value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    /**
     * @dev this function is run before every call
     * it returns a bool indicating weather or not the call is authorized
     * if there are enough assets marked in the _loansByContract list will reach gas limit
     * in such cases releaseAsset methods should be called
     */
    function _beforeCallCheck(address target, bytes memory data) private returns(bool) {
        if (data.length < 4) return true;
        bytes4 funcSel = _extractFunctionSignature(data);
        if(funcSel == APPROVE_ALL_SEL){
            if(_loansByContract[target].length > 0) return false;
            bool approved;
            assembly {
                approved := mload(add(data, 68))
            }
            if(approved) _operatorCount[target]++;
            else {
                address operator;
                assembly{
                    operator := mload(add(data, 36))
                }
                if(!approved) {
                    if(_isApprovedForAll(target, operator)) _operatorCount[target]--;
                }
            }
            return true;
        }
        if(
            funcSel == TRANSFER_SEL ||
            funcSel == SAFE_TRANSFER_SEL ||
            funcSel == SAFE_TRANSFER_DATA_SEL
        ) {
            address from;
            uint256 tokenId;
            assembly {	     
	            from := mload(add(data, 36))
	            tokenId := mload(add(data, 100))
	        }
            if(from == address(this)){
                return !_isLoan(target, tokenId);
            }
        }
        if(funcSel == APPROVE_SEL) {
            uint256 tokenId;
            assembly{
                tokenId := mload(add(data, 68))
            }
            return !_isLoan(target, tokenId);
        }
        
        return true;
    }

    function _isLoan(address contract_, uint256 tokenId) private view returns(bool){
        NFT[] memory loans_ = _loansByContract[contract_];
        for(uint i=0; i<loans_.length; i++){
            if(loans_[i].id == tokenId){
                return true;
            }
        }
        return false;
    }
    
    function _extractFunctionSignature(bytes memory data) private pure returns (bytes4) {
        // require(data.length >= 4, "Invalid data length");
        bytes4 functionSelector;
        assembly {
            functionSelector := mload(add(data, 32))
        }
        return functionSelector;
    }


    function getLoans() external view returns(NFT[] memory) {
        // return _loans;
    }

    function getLoansByContract(address contract_) external view returns(NFT[] memory) {
        return _loansByContract[contract_];
    }

    function getOperatorCount(address contract_) public view returns(uint256) {
        return _operatorCount[contract_];
    }

    /**
     * To be called upon a rental tx by marketplace contract
     * this a requirement for marketplace to be used
     */
    function uponNFTLoan(address _contract, uint256 id, address owner_, uint256 duration) external {
        NFT memory newAsset = NFT(
            _contract,
            id,
            owner_,
            true,
            block.timestamp,
            block.timestamp + duration
        );
        // _loans.push(newAsset);
        _loansByContract[_contract].push(newAsset);
    }

    /**
     * releaseAsset methods
     * releases asset(s) from wallet.
     * should be called by owner in case loans make operations reach gas limit.
     * this might happen because `_isLoan` needs to be called at every userOp
     */
    function releaseSingleAsset(address contract_, uint256 index) public onlyOwner {
        _releaseAsset(contract_, index);
    }

    // function releaseMultipleAssets(uint256[] memory indexes) public onlyOwner {
    //     for(uint256 i=0; i<indexes.length; i++) {
    //         _releaseAsset(indexes[i]);
    //     }
    // }

    function _releaseAsset(address contract_, uint256 index) private {
        IERC721 nftContract = IERC721(_loansByContract[contract_][index].contract_);
        nftContract.safeTransferFrom(
            address(this),
            _loansByContract[contract_][index].lender,
            _loansByContract[contract_][index].id);
        _subAssetFromList(contract_, index);
    }
    
    function _subAssetFromList(address contract_, uint256 index) private returns(uint256) {
        uint256 lastIndex = _loansByContract[contract_].length -1;
        _loansByContract[contract_][index] = _loansByContract[contract_][lastIndex];
        _loansByContract[contract_].pop();
        return lastIndex;
    }

    /**
     * @dev allows any caller to pull asset back to original owner in exchange for a fee
     * checks if assest is a loan and if loan end time was reached
     */
    function pullAsset(address contract_, uint256 index) external {
        require(
            block.timestamp > _loansByContract[contract_][index].endTime,
            "Loan duration not reached"
        );
        _releaseAsset(contract_, index);
    }

    // check: gas efficient alternatives
    // CHANGE: use .call to save gas
    function _getNFTowner(address contract_, uint256 tokenId) private view returns(address) {
        IERC721 nftContract = IERC721(contract_);
        return nftContract.ownerOf(tokenId);
    }

    // CHANGE: use .call to save gas
    function _isApproved(address contract_, uint256 tokenId) private view returns(bool) {
        IERC721 nftContract = IERC721(contract_);
        return nftContract.getApproved(tokenId) != address(0);
    }

    function _isApprovedForAll(address contract_, address operator) private view returns(bool) {
        IERC721 nftContract = IERC721(contract_);
        return nftContract.isApprovedForAll(address(this), operator);
    }


    /**
     * check current account deposit in the entryPoint
     */
    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    /**
     * deposit more funds for this account in the entryPoint
     */
    function addDeposit() public payable {
        entryPoint().depositTo{value : msg.value}(address(this));
    }

    /**
     * withdraw value from the account's deposit
     * @param withdrawAddress target to send to
     * @param amount to withdraw
     */
    function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
        entryPoint().withdrawTo(withdrawAddress, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        (newImplementation);
        _onlyOwner();
    }
}

