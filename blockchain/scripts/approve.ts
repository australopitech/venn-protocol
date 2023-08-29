import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import testnet_nft from '../deployments/aurora_testnet/NFT.json';
import testnet_mktplace from '../deployments/aurora_testnet/BaseMarketPlace.json';
import { token } from "../typechain/@openzeppelin/contracts";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider('https://testnet.aurora.dev');
// const pkey = process.env.PRIVATE_KEY;
const pkey = '0x32e8428c874258e95599f85d16b742389c31d9a422d55e5cf309dac05e12f9b1';
// const apikey = process.env.INFURA_API_KEY;
const lender = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
const walletAddress = '0xf36D84389b2c6846189fBe64dEfBd201f512205A';
// const mktPlaceAddress = '0x3e0D0130FA29D49068804A5e4643506BaD2Df288';
const tokenId = 11;

const main = async() => {
    
    const signer = new ethers.Wallet(pkey, provider);
    const bal = (await provider.getBalance(signer.address)).toString()
    console.log(ethers.utils.formatEther(bal));
    let abi = [
        'function approve(address to, uint256 tokenId)'
    ];
    const iface = new ethers.utils.Interface(abi); 
    const calldata = iface.encodeFunctionData("approve", [
        testnet_mktplace.address,
        tokenId
    ]);
    abi = [
        'function execute(address dest, uint256 value, bytes calldata func) external'
    ];
    const walletContract = new ethers.Contract(walletAddress, abi, signer);
    console.log(`\napproving token ${tokenId} ...`);
    const borrow = await walletContract.execute(testnet_nft.address, 0, calldata);
    const receipt = await borrow.wait();
    console.log(receipt);
    
    const nftContract = new ethers.Contract(testnet_nft.address, testnet_nft.abi, provider);
    console.log(`is approved? tokenId ${tokenId}`);
    const appr = await nftContract.getApproved(tokenId);
    console.log(appr == testnet_mktplace.address);
    console.log(testnet_mktplace.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});