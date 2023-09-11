import { ethers } from "ethers";
import mktplace from '../deployments/base_goerli/MarketPlace.json';
import receipts from '../deployments/base_goerli/ReceiptNFT.json';
import dotenv from 'dotenv';
import { bytes32 } from "../test/solidityTypes";
dotenv.config();

const minter = mktplace.address;
const adminKey = process.env.PRIVATE_KEY;
const adminAddr = process.env.PUBLIC_KEY;
const rpc = process.env.BASE_GOERLI_PROVIDER;

const ADMIN_ROLE = ethers.constants.HashZero;
const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");

const checkRole = async () => {
    if(!rpc || !adminAddr) throw new Error('missing env');
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const receiptContract = new ethers.Contract(receipts.address, receipts.abi, provider);
    const res = await receiptContract.hasRole(MINTER_ROLE, minter );
    console.log('ROLE?', res);
}
checkRole();


const grantMinterRole = async () => {
    if(!adminKey || !rpc) throw new Error('missing env');
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const signer = new ethers.Wallet(adminKey, provider);
    const receiptContract = new ethers.Contract(receipts.address, receipts.abi, signer);

    console.log('signer balance: ', (await signer.getBalance()).toString());
    
    const tx =await receiptContract.grantRole(MINTER_ROLE, minter);
    console.log(await tx.wait());
    
}

// grantMinterRole();