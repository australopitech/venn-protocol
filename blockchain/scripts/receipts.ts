import { ethers } from "ethers";
import mktplace from '../deployments/sepolia/MarketPlace.json';
// import mktplace from '../deployments/polygon_mumbai/MarketPlace.json';
// import receipts from '../deployments/base_goerli/ReceiptNFT.json';
import receipts from '../deployments/sepolia/ReceiptNFT.json';
import dotenv from 'dotenv';
dotenv.config();

const minter = mktplace.address;
// const ADMIN_KEY = process.env.PRIVATE_KEY;
const ADMIN_KEY = process.env.DUMMY_2_PRIVATE_KEY;
const ADMIN_ADDR = process.env.PUBLIC_KEY;
const rpc = process.env.BASE_GOERLI_PROVIDER;

const ADMIN_ROLE = ethers.constants.HashZero;
const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");

// const network = 80001 //mumbai
// const API_KEY = process.env.MUMBAI_ALCHEMY_API_KEY;
const API_KEY = process.env.SEPOLIA_ALCHEMY_API_KEY;
const provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`);



const checkOwner = async() => {
    if(!rpc) throw new Error('missing env');
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const receiptContract = new ethers.Contract(receipts.address, receipts.abi, provider);
    const owner = await receiptContract.ownerOf(3);
    console.log(owner);
}
// checkOwner();

const checkRole = async () => {
    if(!provider) throw new Error('missing env');
    const receiptContract = new ethers.Contract(receipts.address, receipts.abi, provider);
    console.log('minter', minter)
    const res = await receiptContract.hasRole(MINTER_ROLE, minter );
    console.log('ROLE?', res);
}
checkRole();


const grantMinterRole = async () => {
    if(!ADMIN_KEY || !provider) throw new Error('missing env');
    // const provider = new ethers.providers.JsonRpcProvider(rpc);
    const signer = new ethers.Wallet(ADMIN_KEY, provider);
    const receiptContract = new ethers.Contract(receipts.address, receipts.abi, signer);

    console.log('signer balance: ', (await signer.getBalance()).toString());
    console.log('granting minter to', minter)
    
    const tx =await receiptContract.grantRole(MINTER_ROLE, minter);
    console.log(await tx.wait());
    
    await checkRole();
    
}

// grantMinterRole();

const fetchMints = async() => {
 if(!rpc) throw new Error('mising env');
 
 const provider = new ethers.providers.JsonRpcProvider(rpc);
 const contract = new ethers.Contract(receipts.address, receipts.abi, provider);
 const filter = contract.filters.Transfer(ethers.constants.AddressZero);
 const logs = await contract.queryFilter(filter);
 console.log(logs);
}

// fetchMints();

const burn = async() => {
 if(!rpc || !ADMIN_KEY) throw new Error('mising env');
 
 const provider = new ethers.providers.JsonRpcProvider(rpc);
 const signer = new ethers.Wallet(ADMIN_KEY, provider)
 const contract = new ethers.Contract(receipts.address, receipts.abi, signer);
 
 const tokenId = 2;
 const tx = await contract.burn(tokenId);
 console.log(await tx.wait());
}

// burn();