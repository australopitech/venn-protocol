import * as entryPointSepolia from '../deployments/sepolia/EntryPoint.json';
import * as walletAbi from '../artifacts/contracts/wallet/RWallet.sol/RWallet.json';
import { EntryPoint, RWallet } from '../typechain';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const apiKey = process.env.INFURA_API_KEY;
const privateKey = process.env.PRIVATE_KEY;
const walletAddress = '0x94F79a0733f7DBC066253BBaE4003E2f86d28A3d';

const main = async() => {
    if(!apiKey) throw new Error('missing env: API_KEY');
    if(!privateKey) throw new Error('missing env: PRIVATE_KEY');
    const provider = new ethers.providers.InfuraProvider('sepolia', apiKey);
    const signer = new ethers.Wallet(privateKey, provider);
    const entryPoint = new ethers.Contract(
        entryPointSepolia.address,
        entryPointSepolia.abi,
        provider
    ) as EntryPoint;
    const wallet = new ethers.Contract(
        walletAddress,
        walletAbi.abi,
        signer
    );
    const deposit = await wallet.addDeposit({value: ethers.utils.parseEther("0.5")});
    await deposit.wait();
    const balance = await entryPoint.balanceOf(walletAddress);
    console.log(balance);
}

main();