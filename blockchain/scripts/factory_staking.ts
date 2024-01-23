import entryPoint from '../artifacts/contracts/core/EntryPoint.sol/EntryPoint.json';
import factoryBaseGoer from '../deployments/base_goerli/SmartAccountFactory.json';
import { EntryPoint, SmartAccountFactory } from '../typechain';
import { BigNumber, ethers } from 'ethers';
// import config from '../hardhat.config';

import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });


const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const RPC = process.env.BASE_GOERLI_PROVIDER;
const ENTRY_POINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" // mumbai and baseGoerli
const MUMBAI_ALCHEMY_API_KEY = process.env.MUMBAI_ALCHEMY_API_KEY
const network = 80001 // mumbai

const main = async () => {
    // if(!RPC) throw new Error('missing env: API_KEY');
    if(!PRIVATE_KEY || !MUMBAI_ALCHEMY_API_KEY) throw new Error('missing env');
    if(!network) throw new Error('missing network');
    // const provider = new ethers.providers.JsonRpcProvider(RPC);
    const provider = new ethers.providers.AlchemyProvider(network, MUMBAI_ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const entryPointContract = new ethers.Contract(
        ENTRY_POINT,
        entryPoint.abi,
        provider
    ) as EntryPoint;
    const factory = new ethers.Contract(
        factoryBaseGoer.address,
        factoryBaseGoer.abi,
        signer
    ) as SmartAccountFactory;
    const stake = await factory.stake(
        entryPointContract.address,
        4294967295,
        {value: ethers.utils.parseEther("0.1")}
    );
    const receipt = await stake.wait();
    console.log('\nstake tx:', receipt.transactionHash);
    console.log('factoryAddr',factory.address)
    const depositInfo = await entryPointContract.getDepositInfo(factory.address);
    console.log('deposit info:', depositInfo);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});