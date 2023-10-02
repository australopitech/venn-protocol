import { ethers } from "ethers";
import dotenv from "dotenv";
import walletAbi from "../artifacts/contracts/wallet/RWallet.sol/RWallet.json";
import entryPoint from "../artifacts/contracts/core/EntryPoint.sol/EntryPoint.json";
import nft from "../deployments/base_goerli/NFT.json";
dotenv.config();

const WALLET_SIGNER_KEY = process.env.WALLET_SIGNER_KEY;
const WALLET_ADDR = process.env.WALLET_ADDR;
const RPC = process.env.BASE_GOERLI_PROVIDER;
const ENTRY_POINT = process.env.ENTRY_POINT_STACKUP;

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
    const account = new ethers.Contract(WALLET_ADDR, walletAbi.abi, signer);
    
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
    const account = new ethers.Contract(WALLET_ADDR, walletAbi.abi, signer);
    
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

ownerOf();

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



