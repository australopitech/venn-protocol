import { ethers } from "ethers";
import mktplace from "../deployments/base_goerli/MarketPlace.json";
import nft from "../deployments/base_goerli/NFT.json";
import dotenv from "dotenv";
import { delimiter } from "path";

dotenv.config();
const oldMktPlaceAddr = '0xD2cB0110eF568f90d974DDf233090dEe67cdcd60';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC = process.env.BASE_GOERLI_PROVIDER;
const provider = new ethers.providers.JsonRpcProvider(RPC);

const deList = async() => {
    if(!provider || !PRIVATE_KEY) throw new Error('missing env');
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const mktPlaceContract = new ethers.Contract(mktplace.address, mktplace.abi, signer);

    const tokenId = 4;
    const tx = await mktPlaceContract.deList(nft.address, tokenId);

    console.log(await tx.wait());
    console.log("\nchecking new owner...");
    const nftContract = new ethers.Contract(nft.address, nft.abi, provider);
    const newOwner = await nftContract.ownerOf(tokenId);
    console.log(`owner == signer?`, newOwner === signer.address );
} 

// deList();

const getNFTByReceipt = async() => {
    const mktPlaceContract = new ethers.Contract(mktplace.address, mktplace.abi, provider);
    // console.log('test', mktPlaceContract.address)
    const receiptId = 7;
    const nftObj = await mktPlaceContract.getNFTbyReceipt(receiptId);
    console.log(`tokenId: ${nftObj.tokenId.toString()}`);
}

// getNFTByReceipt();

const getListData = async() => {
    if(!provider) throw new Error('missing env')
    const mktPlaceContract = new ethers.Contract(mktplace.address, mktplace.abi, provider);
    // 
    const tokenId = 4;
    // 
    const maxDur = await mktPlaceContract.getMaxDuration(nft.address, tokenId);
    console.log('maxDuration' , maxDur.toString());
    const price = await mktPlaceContract.getPrice(nft.address, tokenId);
    console.log('price', price.toString());
}

// getListData();

const test = () => {
    // console.log(ethers.utils.id("deList(address,uint256)"));
    // console.log(ethers.utils.id("getMaxduration(address,uint256)"))
    // console.log(ethers.utils.id("getPrice(address,uint256)"))
    // console.log(ethers.utils.id("getNFTbyReceipt(uint256)"));
    // console.log(ethers.utils.id("rentNFT(address,uint256,uint256)"));
    // console.log(ethers.utils.id('getPullFee(uint256)'))
    // console.log(ethers.utils.id('serviceAliquot()'))
    // console.log(ethers.utils.id('getReceipt(address,uint256)'))
    // console.log(ethers.utils.id('getBalance(address)'))
    // console.log(ethers.utils.id('isWallet(address)'))
    // console.log(ethers.utils.id('listNFT(address,uint256,uint256,uint256)'))
    // console.log(ethers.utils.id('deList(address,uint256)'))
    // console.log(ethers.utils.id('pullAsset(address,uint256)'))

    // console.log(ethers.utils.id('isWallet(address)'))
    // console.log(ethers.utils.id('isRental(address,uint256)'))

    
    // console.log(ethers.utils.id('getApproved(uint256)'))
    // console.log(ethers.utils.id("isApprovedForAll(address,address)"))
    console.log(ethers.utils.id("ownerOf(uint256)"));
    // console.log(ethers.utils.formatEther(10040000000000));

}

test();