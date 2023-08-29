import { ethers } from "ethers";
import * as dotenv from 'dotenv';

dotenv.config();

// const network = 'sepolia';
const network = 'goerli';
const pkey = process.env.PRIVATE_KEY;
const apikey = process.env.INFURA_API_KEY;
const wallet = '0x088F73ADf40B43c74aEd612FC14186A9d44e7Cce';
const rpc = process.env.BASE_GOERLI_PROVIDER;
const walletSignerKey = process.env.WALLET_SIGNER_KEY;
const walletSignerAddr = process.env.WALLET_SIGNER_ADDR;

const checkBal = async () => {
    if(!pkey || !rpc) throw new Error('missing env');
    if(!walletSignerAddr) throw new Error('missing signer');
    // const provider = new ethers.providers.InfuraProvider(network, apikey);
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const signer = new ethers.Wallet(pkey, provider);
    // console.log(signer.address);
    // const bal = (await signer.getBalance()).toString();
    const bal = await provider.getBalance(walletSignerAddr);
    console.log(ethers.utils.formatEther(bal));
}

// checkBal().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });

const sendMoney = async () => {
    if(!pkey || !rpc || !walletSignerKey || !walletSignerAddr) throw new Error('missing env');
    // const provider = new ethers.providers.InfuraProvider(network, apikey);
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    // const signer = new ethers.Wallet(pkey, provider);
    const signer = new ethers.Wallet(walletSignerKey, provider);
    // const addr = await signer.getAddress();
    console.log('recAddr', wallet);
    const tx = {
        from: signer.address,
        to: wallet,
        value: ethers.utils.parseEther('0.001'),
    }
    const send = await signer.sendTransaction(tx);
    const receipt = await send.wait();
    console.log(receipt);
}

sendMoney().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

