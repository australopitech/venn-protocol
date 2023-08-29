import * as entryPointSepolia from '../deployments/sepolia/EntryPoint.json';
import * as factorySepolia from '../deployments/sepolia/RWalletFactory.json'
import { EntryPoint, RWalletFactory } from '../typechain';
import { ethers } from 'ethers';

import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });


const apiKey = process.env.INFURA_API_KEY;
const privateKey = process.env.PRIVATE_KEY;

const main = async () => {
    if(!apiKey) throw new Error('missing env: API_KEY');
    if(!privateKey) throw new Error('missing env: PRIVATE_KEY');
    const provider = new ethers.providers.InfuraProvider('sepolia', apiKey);
    const signer = new ethers.Wallet(privateKey, provider);
    const entryPoint = new ethers.Contract(
        entryPointSepolia.address,
        entryPointSepolia.abi,
        provider
    ) as EntryPoint;
    const factory = new ethers.Contract(
        factorySepolia.address,
        factorySepolia.abi,
        signer
    ) as RWalletFactory;
    const stake = await factory.stake(
        entryPointSepolia.address,
        10000,
        {value: ethers.utils.parseEther("0.5")}
    );
    const receipt = await stake.wait();
    console.log('\nstake tx:', receipt.transactionHash);
    const depositInfo = await entryPoint.getDepositInfo(factory.address);
    console.log(depositInfo);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});