import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import walletAbi from "../artifacts/contracts/wallet/RWallet.sol/RWallet.json";
import mktPlace from "../deployments/base_goerli/MarketPlace.json";
import nft from "../deployments/base_goerli/NFT.json";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const WALLET_ADDR = process.env.WALLET_ADDR;
const WALLET_SIGNER_KEY = process.env.WALLET_SIGNER_KEY;
const RPC = process.env.BASE_GOERLI_PROVIDER;
// const mktPlaceAddress = '0x3e0D0130FA29D49068804A5e4643506BaD2Df288';
const provider = new ethers.providers.JsonRpcProvider(RPC);

const main = async () => {
    if(!WALLET_SIGNER_KEY || !WALLET_ADDR) throw new Error('missing env');
    const signer = new ethers.Wallet(WALLET_SIGNER_KEY, provider);    
    let abi = [
        'function rentNFT(address contract_, uint256 tokenId, uint256 duration)'
    ];
    // 
    const tokenId = 6;
    //
    const mktPlaceContract = new ethers.Contract(mktPlace.address, mktPlace.abi, provider);
    const maxDur = await mktPlaceContract.getMaxDuration(nft.address, tokenId); 
    const duration = maxDur.sub(1);
    console.log('duration: ', duration.toString());
    const iface = new ethers.utils.Interface(abi); 
    const calldata = iface.encodeFunctionData("rentNFT", [
        nft.address,
        tokenId,
        duration
    ]);
    const price = await mktPlaceContract.getPrice(nft.address, tokenId);
    const aliq = await mktPlaceContract.serviceAliquot();
    const fee = price.mul(duration).mul(aliq).div(10000);
    const value  = price.mul(duration).add(fee);
    abi = [
        'function execute(address dest, uint256 value, bytes calldata func) external'
    ];
    const walletContract = new ethers.Contract(WALLET_ADDR, abi, signer);
    console.log(`\nrenting token ${tokenId} ...`);
    const borrow = await walletContract.execute(mktPlace.address, value, calldata);
    const receipt = await borrow.wait();
    console.log(receipt);
}

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });

const checkTimeLeft = async() => {
    if(!WALLET_ADDR) throw new Error('missing env');
    // 
    const tokenId = 2;
    // 
    // const blockNo = await provider.getBlockNumber();
    const blockNo = 10411032;
    const block = await provider.getBlock(blockNo);
    const walletContract = new ethers.Contract(WALLET_ADDR, walletAbi.abi, provider);
    const rentals = await walletContract.getRentals();
    const tokenIndex = await walletContract.getTokenIndex(nft.address, tokenId);
    const timeLeft = rentals[tokenIndex].endTime.sub(block.timestamp);
    
    console.log(
        `-blocktime: ${block.timestamp}\n-endTime: ${rentals[tokenIndex].endTime.toNumber()}\n-timeLeft: ${timeLeft.toString()}`
    );
}

checkTimeLeft();