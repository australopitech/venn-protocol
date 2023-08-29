import { ethers } from "ethers";
import * as dotenv from 'dotenv';

dotenv.config();

// const network = 'sepolia';
const network = 'goerli';
const pkey = process.env.PRIVATE_KEY;
const apikey = process.env.INFURA_API_KEY;
const wallet = '0x69bCae489855Ed1365BE1252D5237Ab8603B9bd3';

const checkBal = async () => {
    if(!pkey || !apikey) throw new Error('missing env');
    // const provider = new ethers.providers.InfuraProvider(network, apikey);
    const provider = new ethers.providers.JsonRpcProvider('https://testnet.aurora.dev');
    const signer = new ethers.Wallet(pkey, provider);
    const bal = (await signer.getBalance()).toString();
    console.log(ethers.utils.formatEther(bal));
}

const main = async () => {
    console.log(pkey);
    console.log(apikey);
    if(!pkey || !apikey) throw new Error('missing env');
    // const provider = new ethers.providers.InfuraProvider(network, apikey);
    const provider = new ethers.providers.JsonRpcProvider('https://testnet.aurora.dev');
    const signer = new ethers.Wallet(pkey, provider);
    const addr = await signer.getAddress();
    console.log('pubkey', addr);
    const tx = {
        from: addr,
        to: '0xf36D84389b2c6846189fBe64dEfBd201f512205A',
        value: ethers.utils.parseEther('0.02'),
    }
    const send = await signer.sendTransaction(tx);
    const receipt = await send.wait();
    console.log(receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// checkBal().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });