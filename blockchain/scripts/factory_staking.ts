import entryPoint from '../artifacts/contracts/mock/EntryPoint.sol/EntryPoint.json';
// import factoryMumbai from '../deployments/polygon_mumbai/SmartAccountFactory.json'
import factorySepolia from "../deployments/sepolia/SmartAccountFactory.json";
import { EntryPoint, SmartAccountFactory } from '../typechain';
import { BigNumber, ethers } from 'ethers';
// import config from '../hardhat.config';

import dotenv from 'dotenv';
import { parseEther } from 'ethers/lib/utils';
dotenv.config({ path: './.env' });


const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const RPC = process.env.BASE_GOERLI_PROVIDER;
const ENTRY_POINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" // mumbai and baseGoerli and sepolia
const API_KEY = process.env.SEPOLIA_ALCHEMY_API_KEY
const provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`);

const oldFactory = "0x2C65c7Ed61246a6702d8bb5643E3B945cbD515C1";

const main = async () => {
    // if(!RPC) throw new Error('missing env: API_KEY');
    if(!PRIVATE_KEY) throw new Error('missing env');
    // const provider = new ethers.providers.JsonRpcProvider(RPC);
    console.log('using factory ', factorySepolia.address);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const entryPointContract = new ethers.Contract(
        ENTRY_POINT,
        entryPoint.abi,
        provider
    ) as EntryPoint;
    const factory = new ethers.Contract(
        factorySepolia.address,
        factorySepolia.abi,
        signer
    ) as SmartAccountFactory;
    const stake = await factory.stake(
        entryPointContract.address,
        87000,
        {value: ethers.utils.parseEther("0.1")}
    );
    const receipt = await stake.wait();
    console.log('\nstake tx:', receipt.transactionHash);
    const depositInfo = await entryPointContract.getDepositInfo(factory.address);
    console.log('stake:', ethers.utils.formatEther(depositInfo.stake.toString()));
    console.log('delay: ', depositInfo.unstakeDelaySec);
}

const getDepositInfo = async (acc: string) => {
    const entryPointContract = new ethers.Contract(
        ENTRY_POINT,
        entryPoint.abi,
        provider
    ) as EntryPoint;
    const depositInfo = await entryPointContract.getDepositInfo(acc);
    // console.log('stake:', ethers.utils.formatEther(depositInfo.stake.toString()));
    console.log('depositInfo', depositInfo);
}

// getDepositInfo(oldFactory);

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

const func = () => {
    console.log(ethers.utils.formatEther("700000000000000000"));
}

// func();