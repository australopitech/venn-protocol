import { ethers } from 'ethers';
import { RWalletFactory } from '../typechain';
import factory from "../deployments/base_goerli/RWalletFactory.json";
import dotenv from 'dotenv';
dotenv.config({ path: __dirname+'/../.env' });

const newWallet = '0x0539a9539d86c987371D93131321771D082fAce9'; // be
const RPC = process.env.BASE_GOERLI_PROVIDER;
const FACTORY_OLD = '0x470459A74DD5ace425A7bd52c537847DaDeF7F91';

const main = async () => {
    if(!RPC || !FACTORY_OLD) throw new Error("missing env: API_KEY");
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const walletFactory = new ethers.Contract(
        FACTORY_OLD,
        factory.abi,
        provider
    ) as RWalletFactory;
    
    // console.log(provider);
    const isWallet = await walletFactory.isWallet(newWallet);
    console.log('isWallet', isWallet);
}
main();