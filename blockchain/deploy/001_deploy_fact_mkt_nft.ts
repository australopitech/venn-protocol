import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import * as NFT from '../artifacts/contracts/samples/NFT.sol/NFT.json';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const BASE_GOERLI_PROVIDER = process.env.BASE_GOERLI_PROVIDER;
const ENTRY_POINT = process.env.ENTRY_POINT_STACKUP;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if(!ENTRY_POINT) throw new Error('missing env');
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  if(!BASE_GOERLI_PROVIDER) throw new Error('missing provider');
  const provider = new ethers.providers.JsonRpcProvider(BASE_GOERLI_PROVIDER);
  const gasPrice = (await provider.getGasPrice());
  
  // await deploy('Dummy', {
  //     from: deployer,
  //     args: [],
  //     log: true
  //   });
    
  await deploy('RWalletFactory', {
    from: deployer,
    args: [ENTRY_POINT],
    log: true,
    gasPrice: gasPrice
  });

  const RWalletFactory = await deployments.get('RWalletFactory');
  console.log('factory address got', RWalletFactory.address);

  await deploy('ReceiptNFT', {
    from: deployer,
    args:[],
    log: true,
    gasPrice: gasPrice
  });

  const receiptContract = await deployments.get('ReceiptNFT');
  console.log('receipts address got', receiptContract.address);

  await deploy('MarketPlace', {
    from: deployer,
    args: [
      RWalletFactory.address,
      receiptContract.address,
      40,
      2500,
      '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A'
    ],
    log: true,
    gasPrice: gasPrice
  });

  await deploy('NFT', {
    from: deployer,
    args: [],
    log: true,
    gasPrice: gasPrice
  });

};
module.exports.default = func;
func.tags = [];
