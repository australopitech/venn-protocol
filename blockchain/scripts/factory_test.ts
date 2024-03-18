import { ethers } from 'ethers';
import { SmartAccountFactory } from '../typechain';
import factory from "../deployments/polygon_mumbai/SmartAccountFactory.json";
import dotenv from 'dotenv';
dotenv.config({ path: __dirname+'/../.env' });

const newWallet = '0x0539a9539d86c987371D93131321771D082fAce9'; // be
// const RPC = process.env.BASE_GOERLI_PROVIDER;
const API_KEY = process.env.MUMBAI_ALCHEMY_API_KEY
const provider = new ethers.providers.AlchemyProvider(80001, API_KEY);
const FACTORY_OLD = '0x470459A74DD5ace425A7bd52c537847DaDeF7F91';

const main = async () => {
    if(!API_KEY) throw new Error("missing env: API_KEY");
    const _factory = new ethers.Contract(
        factory.address,
        factory.abi,
        provider
    ) as SmartAccountFactory;
    
    const accImpl = await _factory.accountImplementation();
    console.log('account impl addr', accImpl);
}
main();