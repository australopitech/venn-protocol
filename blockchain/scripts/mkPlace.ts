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

    const tokenId = 7;
    const tx = await mktPlaceContract.deList(nft.address, tokenId);

    console.log(await tx.wait());
    console.log("\nchecking new owner...");
    const nftContract = new ethers.Contract(nft.address, nft.abi, provider);
    const newOwner = await nftContract.ownerOf(tokenId);
    console.log(`owner == signer?`, newOwner === signer.address );
} 

// deList();

const getListData = async() => {
    if(!provider) throw new Error('missing env')
    const mktPlaceContract = new ethers.Contract(mktplace.address, mktplace.abi, provider);
    const maxDur = await mktPlaceContract.getMaxDuration(nft.address, 9);
    console.log(maxDur.toString());
}

// getListData();

const test = () => {
    // console.log(ethers.utils.id("deList(address,uint256)"));
    // console.log(mktplace.address);
    // console.log(nft.address);
    // console.log(ethers.utils.id("getMaxduration(address,uint256)"))
    // console.log(ethers.utils.id("getPrice(address,uint256)"))
    console.log(ethers.utils.id("isApprovedForAll(address,address)"))

}

test();