import { ethers } from "ethers";
import * as dotenv from 'dotenv';

dotenv.config();

const aurora_testnet = 'https://testnet.aurora.dev';
const provider = new ethers.providers.JsonRpcProvider('https://testnet.aurora.dev');
// const pkey = process.env.PRIVATE_KEY;
const pkey = '0x32e8428c874258e95599f85d16b742389c31d9a422d55e5cf309dac05e12f9b1';
// const apikey = process.env.INFURA_API_KEY;
const lender = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
const walletAddress = '0xf36D84389b2c6846189fBe64dEfBd201f512205A';
const mktPlaceAddress = '0x3e0D0130FA29D49068804A5e4643506BaD2Df288';
const index = 0;
const duration = 10;
const value = (180000000000000*duration)+((180000000000000*10)*3)/1000;

const main = async () => {
    // if(!pkey || !apikey) throw new Error('missing env');
    const signer = new ethers.Wallet(pkey, provider);    
    let abi = [
        'function borrowNFT(address lender, uint256 index, uint256 duration) public payable'
    ];
    const iface = new ethers.utils.Interface(abi); 
    const calldata = iface.encodeFunctionData("borrowNFT", [
        lender,
        ethers.BigNumber.from(index.toString()),
        ethers.BigNumber.from(duration.toString())
    ]);
    abi = [
        'function execute(address dest, uint256 value, bytes calldata func) external'
    ];
    const walletContract = new ethers.Contract(walletAddress, abi, signer);
    console.log('\nborrowing...');
    const borrow = await walletContract.execute(mktPlaceAddress, value, calldata);
    const receipt = await borrow.wait();
    console.log(receipt);
}

const pkeyCheck = async() => {
    const signer = new ethers.Wallet(pkey, provider);
    const address = await signer.getAddress();
    console.log(address == '0xf4AAaDd641A3Ce951a225350162b734092B5eB02');
} 

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});