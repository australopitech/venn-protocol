// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

bytes4 constant TRANSFER_SEL = bytes4(keccak256(bytes("transferFrom(address,address,uint256)")));

bytes4 constant SAFE_TRANSFER_SEL = bytes4(keccak256(bytes("safeTransferFrom(address,address,uint256)")));

bytes4 constant SAFE_TRANSFER_DATA_SEL = bytes4(keccak256(bytes("safeTransferFrom(address,address,uint256,bytes)")));

bytes4 constant APPROVE_SEL = bytes4(keccak256(bytes("approve(address,uint256)")));

bytes4 constant APPROVE_ALL_SEL = bytes4(keccak256(bytes("setApprovalForAll(address,bool)")));