import * as contract from '../deployments/sepolia/RWalletFactory.json';
import { ethers } from 'ethers';
import { RWalletFactory } from '../typechain';
import dotenv from 'dotenv';
import * as siloContract from '../deployments/aurora_hack_silo/RWalletFactory.json';
dotenv.config({ path: __dirname+'/../.env' });

const newWallet = '0x94F79a0733f7DBC066253BBaE4003E2f86d28A3d';
const apiKey = process.env.INFURA_API_KEY;
const pkey = process.env.PRIVATE_KEY;

const main = async () => {
    if(!apiKey) throw new Error("missing env: API_KEY");
    const provider = new ethers.providers.InfuraProvider("sepolia", apiKey );
    const walletFactory = new ethers.Contract(
        contract.address,
        contract.abi,
        provider
    ) as RWalletFactory;
    
    // console.log(provider);
    const isWallet = await walletFactory.isWallet(newWallet);
    console.log(isWallet);
}

const auroraSilosCreateTest = async () => {
    if(!pkey) throw new Error('missing env');
    const provider = new ethers.providers.JsonRpcProvider('https://hackathon.aurora.dev');
    // console.log(await provider.getCode('0xf736d7285C717fa2A4dE0c49dd4a0701B2B69F78'));
    const signer = new ethers.Wallet(pkey, provider);
    const addr = await signer.getAddress();
    console.log(addr);
    const factory_address = '0xf736d7285C717fa2A4dE0c49dd4a0701B2B69F78';
    const factory = new ethers.Contract(factory_address, siloContract.abi, signer);
    // const impl = await factory.accountImplementation();
    // console.log(impl);
    // const create = await factory.createAccount(addr, 2);
    // const receipt = await create.wait();
    // console.log(`tx: ${create.transactionHash}`);
    // console.log(receipt);
    const isWallet = await factory.isWallet(addr);
    console.log(isWallet);

}


auroraSilosCreateTest().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

