import { ethers } from "ethers";
import * as dotenv from 'dotenv';

dotenv.config();


const PRIVATE_KEY = process.env.PRIVATE_KEY;
const WALLET = process.env.WALLET_ADDR;
const RPC = process.env.BASE_GOERLI_PROVIDER;
const WALLET_SIGNER_KEY = process.env.WALLET_SIGNER_KEY;
const WALLET_SIGNER_ADDR = process.env.WALLET_SIGNER_ADDR;

const checkBal = async () => {
    if(!PRIVATE_KEY || !RPC) throw new Error('missing env');
    if(!WALLET_SIGNER_KEY) throw new Error('missing signer');
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const signer = new ethers.Wallet(WALLET_SIGNER_KEY, provider);
    // console.log(signer.address);
    const bal = (await signer.getBalance()).toString();
    // const bal = await provider.getBalance(walletSignerAddr);
    console.log(ethers.utils.formatEther(bal));
}

// checkBal();


const sendMoney = async () => {
    if(!PRIVATE_KEY || !RPC) throw new Error('missing env');
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    // const addr = await signer.getAddress();
    const tx = {
        from: signer.address,
        to: WALLET,
        value: ethers.utils.parseEther('0.002'),
    }
    const send = await signer.sendTransaction(tx);
    const receipt = await send.wait();
    console.log(receipt);
}

sendMoney().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

