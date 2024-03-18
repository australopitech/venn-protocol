import { ethers } from "ethers";
import dotenv from "dotenv";
import vsa from "../artifacts/contracts/protocol/SmartAccount.sol/SmartAccount.json";
import entryPoint from "../artifacts/contracts/core/EntryPoint.sol/EntryPoint.json";
import nft from "../deployments/polygon_mumbai/NFT.json";
import { error } from "console";
dotenv.config();

const WALLET_SIGNER_KEY = process.env.WALLET_SIGNER_KEY;
const WALLET_ADDR = process.env.WALLET_ADDR;
const RPC = process.env.BASE_GOERLI_PROVIDER;
const ENTRY_POINT = process.env.ENTRY_POINT_STACKUP;
const API_KEY = process.env.MUMBAI_ALCHEMY_API_KEY;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const networkID = 80001
const provider = new ethers.providers.AlchemyProvider(networkID, API_KEY);

const acc = "0x58530cB75bD6a084DBe5bceF65416262625018BE";


const tokenUri = async() => {
    if(!RPC) throw new Error('missing env');
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const contr = new ethers.Contract(nft.address, nft.abi, provider);
    // 
    const tokenId = 2;
    // 
    console.log( await contr.tokenURI(tokenId))
}

// tokenUri();
const NFT_ADDRESS = process.env.NFT_ADDRESS;
const release = async () => {
    if(!WALLET_ADDR || ! WALLET_SIGNER_KEY || !RPC || !ENTRY_POINT || !NFT_ADDRESS) throw new Error('missing env');

    console.log('wallet', WALLET_ADDR)
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const signer = new ethers.Wallet(WALLET_SIGNER_KEY, provider);
    const account = new ethers.Contract(WALLET_ADDR, vsa.abi, signer);
    
    const tokenId = 6;

    // const tokenIndex = await account.getTokenIndex(NFT_ADDRESS, tokenId);
    // console.log(`tokenIndex ${tokenIndex}`);
    const tx = await account.releaseSingleAsset(0);
    console.log(await tx.wait()); 
}
// release();

const getRentals = async() => {
    if(!WALLET_ADDR || ! WALLET_SIGNER_KEY || !RPC || !ENTRY_POINT) throw new Error('missing env');
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const signer = new ethers.Wallet(WALLET_SIGNER_KEY, provider);
    const account = new ethers.Contract(WALLET_ADDR, vsa.abi, signer);
    
    const rentals = await account.getRentals();
    console.log(rentals);
}
// getRentals();

const ownerOf = async() => {
    if(!NFT_ADDRESS) throw new Error('missing env')
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const contr = new ethers.Contract(NFT_ADDRESS, nft.abi, provider);
    const tokenId = 0;
    console.log(`ownerOf ${tokenId}: ${await contr.ownerOf(tokenId)}`);
}

// ownerOf();

const checkBal = async () => {
    if(!RPC) throw new Error('missing env');
    if(!WALLET_SIGNER_KEY) throw new Error('missing signer');
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const signer = new ethers.Wallet(WALLET_SIGNER_KEY, provider);
    // console.log(signer.address);
    const bal = (await signer.getBalance()).toString();
    // const bal = await provider.getBalance(walletSignerAddr);
    console.log(ethers.utils.formatEther(bal));
}
// checkBal();
const pull = async () => {
    if(!provider) throw new Error('missing provider');
    if(!PRIVATE_KEY) throw new Error('missing env');
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const account = new ethers.Contract(acc, vsa.abi, signer);
    
    const pull = await account.pullAsset(0);
    const rec = await pull.wait();
    console.log(rec);
}

// pull().catch((err) => {
//     console.error(err);
//     process.exitCode = 1;
// });

const getIndex = async () => {
  if(!provider) throw new Error('missing provider');
  if(!PRIVATE_KEY) throw new Error('missing env');
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const account = new ethers.Contract(acc, vsa.abi, signer);
  
  const index = await account.getTokenIndex(nft.address, 5);
  console.log('index', index.toString());
}

getIndex();