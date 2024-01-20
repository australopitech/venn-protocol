import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import * as NFT from '../artifacts/contracts/samples/NFT.sol/NFT.json';
import * as dotenv from 'dotenv';
import { getDefaultProvider } from 'ethers';
dotenv.config({ path: '../.env' });

const ENTRY_POINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" //mumbai and baseGoerli
const API_KEY = process.env.BASE_GOERLI_ALCHEMY_API_KEY;
// const API_KEY = process.env.MUMBAI_ALCHEMY_API_KEY;
const requiredNonce = 0;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if(!ENTRY_POINT || !API_KEY) throw new Error('missing env');
  const {deployments, getNamedAccounts, network} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  const provider = new ethers.providers.JsonRpcProvider(`https://base-goerli.g.alchemy.com/v2/${process.env.BASE_GOERLI_ALCHEMY_API_KEY}`);
  const nonce = (await provider.getTransactionCount(deployer)) - 1;
  console.log('account nonce: ', nonce >= 0 ? nonce : 'none');
  if(nonce >= 0) throw new Error('nonce greater then zero');

  // const gasPrice = (await provider.getGasPrice());
  
  // await deploy('Dummy', {
  //     from: deployer,
  //     args: [],
  //     log: true
  //   });
    
  await deploy('SmartAccountFactory', {
    from: deployer,
    args: [ENTRY_POINT],
    log: true,
    // gasPrice: gasPrice
  });

  const RWalletFactory = await deployments.get('SmartAccountFactory');
  console.log('factory address got', RWalletFactory.address);

  await deploy('ReceiptNFT', {
    from: deployer,
    args:[],
    log: true,
    // gasPrice: gasPrice
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
    // gasPrice: gasPrice
  });

  // await deploy('NFT', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  //   // gasPrice: gasPrice
  // });

};
module.exports.default = func;
func.tags = [];
