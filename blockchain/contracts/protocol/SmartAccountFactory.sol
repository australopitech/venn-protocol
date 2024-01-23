// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import "./SmartAccount.sol";
import "../interfaces/IEntryPoint.sol";

/**
 * A UserOperations "initCode" holds the address of the factory, and a method call (to createAccount, in this sample factory).
 * The factory's createAccount returns the target account address even if it is already installed.
 * This way, the entryPoint.getSenderAddress() can be called either before or after the account is created.
 */
contract SmartAccountFactory {
    SmartAccount public immutable accountImplementation;

    mapping (address => bool) private _isSmartAccount;

    event SmartAccountCreated(address indexed owner, address indexed account);

    constructor(IEntryPoint _entryPoint) {
        accountImplementation = new SmartAccount(_entryPoint);
    }

    /**
     * checks weather or not an address is a Smart Account created via this contract
     */
    function isSmartAccount(address account) external view returns(bool) {
        return _isSmartAccount[account];
    }

    /**
     * create an account, and return its address.
     * returns the address even if the account is already deployed.
     * Note that during UserOperation execution, this method is called only if the account is not deployed.
     * This method returns an existing account address so that entryPoint.getSenderAddress() would work even after account creation
     */
    function createAccount(address owner,uint256 salt) public returns (SmartAccount ret) {
        address addr = getAddress(owner, salt);
        uint codeSize = addr.code.length;
        if (codeSize > 0) {
            return SmartAccount(payable(addr));
        }
        _isSmartAccount[addr] = true; // saves address as a created Smart Account
        emit SmartAccountCreated(owner, addr);
        ret = SmartAccount(payable(new ERC1967Proxy{salt : bytes32(salt)}(
                address(accountImplementation),
                abi.encodeCall(SmartAccount.initialize, (owner))
            )));
    }

    /**
     * calculate the counterfactual address of this account as it would be returned by createAccount()
     */
    function getAddress(address owner,uint256 salt) public view returns (address) {
        return Create2.computeAddress(bytes32(salt), keccak256(abi.encodePacked(
                type(ERC1967Proxy).creationCode,
                abi.encode(
                    address(accountImplementation),
                    abi.encodeCall(SmartAccount.initialize, (owner))
                )
            )));
    }

    function stake(address entryPoint, uint32 unstakeDelaySec) external payable {
        (bool success, ) = entryPoint.call{value: msg.value}(
            abi.encodeWithSignature("addStake(uint32)", unstakeDelaySec)
        );
        require(success, "stake call failed");
    }

    function unlockStake(address entryPoint) external {
        (bool success, ) = entryPoint.call(abi.encodeWithSignature("unlockStake()"));
        require(success, "unlock stake call failed");
    }
}
