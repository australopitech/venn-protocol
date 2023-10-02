import entryPoint from '../artifacts/contracts/core/EntryPoint.sol/EntryPoint.json';
import factoryBaseGoer from '../deployments/base_goerli/RWalletFactory.json';
import { EntryPoint, RWalletFactory } from '../typechain';
import { ethers } from 'ethers';

import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });


const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC = process.env.BASE_GOERLI_PROVIDER;
const ENTRY_POINT = process.env.ENTRY_POINT_STACKUP;

const main = async () => {
    if(!RPC) throw new Error('missing env: API_KEY');
    if(!PRIVATE_KEY || !ENTRY_POINT) throw new Error('missing env');
    const provider = new ethers.providers.JsonRpcProvider(RPC);
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
    ) as RWalletFactory;
    const stake = await factory.stake(
        entryPointContract.address,
        10000,
        {value: ethers.utils.parseEther("0.05")}
    );
    const receipt = await stake.wait();
    console.log('\nstake tx:', receipt.transactionHash);
    const depositInfo = await entryPointContract.getDepositInfo(factory.address);
    console.log(depositInfo);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});