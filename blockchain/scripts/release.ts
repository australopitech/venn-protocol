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

const release = async () => {
    if(!WALLET_ADDR || ! WALLET_SIGNER_KEY || !RPC || !ENTRY_POINT) throw new Error('missing env');

    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const signer = new ethers.Wallet(WALLET_SIGNER_KEY, provider);
    const account = new ethers.Contract(WALLET_ADDR, walletAbi.abi, signer);
    
    // const accountAbi = new ethers.utils.Interface(walletAbi.abi);
    // const ep = new ethers.Contract(ENTRY_POINT, entryPoint.abi, provider);

    // const nonce = await account.getNonce();
    const tokenId = 6;

    const tokenIndex = await account.getTokenIndex(nft.address, tokenId);
    console.log(`tokenIndex ${tokenIndex}`);
    // const tx = await account.releaseSingleAsset(tokenIndex);
    // console.log(await tx.wait()); 
}
release();

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
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const contr = new ethers.Contract(nft.address, nft.abi, provider);
    const tokenId = 2;
    console.log(`ownerOf ${tokenId}: ${await contr.ownerOf(tokenId)}`);
}

// ownerOf();


