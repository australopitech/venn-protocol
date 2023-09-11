import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import * as NFT from '../artifacts/contracts/samples/NFT.sol/NFT.json';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

// const pkey = process.env.PRIVATE_KEY;
// const apikey = process.env.INFURA_API_KEY;
// const walletAddress = '0x6711645aB591f86B31CC97667f393A78d01f5Ca0';
const factory_address = process.env.FACTORY_ADDRESS_OUTDATED;
const base_provider = process.env.BASE_GOERLI_PROVIDER;
const entryPoint = process.env.ENTRY_POINT_STACKUP;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if(!entryPoint) throw new Error('missing env');
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  if(!base_provider) throw new Error('missing provider');
  const provider = new ethers.providers.JsonRpcProvider(base_provider);
  const gasPrice = (await provider.getGasPrice());
  // await deploy('EntryPoint', {
  //   from: deployer,
  //   args: [],
  //   log: true
  // });

  // const entryPoint = (await deployments.get('EntryPoint')).address;
  // console.log('ep:',entryPoint);
  
  await deploy('RWalletFactory', {
    from: deployer,
    args: [entryPoint],
    log: true,
  });

  const RWalletFactory = await deployments.get('RWalletFactory');
  // const RWalletFactoryAddress = '0x684705F4A1C7cF696aD45e62Ea9E28e37a94b530';

  await deploy('ReceiptNFT', {
    from: deployer,
    args:[],
    log: true,
    gasPrice: gasPrice
  });

  const receiptContract = await deployments.get('ReceiptNFT');

  // if(!factory_address || !receiptContract) throw new Error('Market Place deploy: missing args');
  await deploy('MarketPlace', {
    from: deployer,
    args: [
      RWalletFactory.address,
      receiptContract.address,
      40,
      2500,
      deployer
    ],
    log: true,
    gasPrice: gasPrice
  });

  // if(!pkey || !apikey) throw new Error('missing enviroment');
  // await deploy('NFT', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });

  // const [owner] = await ethers.getSigners();
  // const provider = new ethers.providers.InfuraProvider("sepolia", apikey);
  // const provider = new ethers.providers.JsonRpcProvider('https://testnet.aurora.dev');
  // const signer = new ethers.Wallet(pkey, provider);
  // const addr = await signer.getAddress();
  // const NFTaddress = (await deployments.get('NFT')).address;
  // const NFTcontract = new ethers.Contract(
  //   NFTaddress,
  //   NFT.abi,
  //   signer
  // );
  // console.log('\nminting...');
  // const tx = await NFTcontract.safeMint(addr);
  // const receipt = await tx.wait();
  // const mintEvent = receipt.events?.find(
  //   (event: any) => event.event === 'Transfer'
  // );
  // const tokenId = mintEvent?.args?.tokenId;
  // console.log(`\nmint tx: ${receipt.transactionHash}`); 
  // const nftOwner = await NFTcontract.ownerOf(tokenId);
  // console.log(nftOwner == addr);
  
  // const [owner, dummy] = await ethers.getSigners();
  // // console.log('\ndeployer = owner:', deployer === owner.address);
  // const nft = await deployments.get('NFT');
  // const nftContract = new ethers.Contract(
  //   nft.address,
  //   nft.abi,
  //   owner  
  // );
  // let tx = await nftContract.safeMint(dummy.address);
  // let receipt = await tx.wait();
  // const tokenId = receipt.events[0].args.tokenId;
  // console.log(
  //   `\ntoken ${tokenId} minted to ${dummy.address}\ntx: ${receipt.transactionHash}`
  // );

  // const ownerOf_0 = await nftContract.ownerOf(tokenId);
  // console.log('ownerOf test:', ownerOf_0 === dummy.address);
  // const bal = await nftContract.balanceOf(dummy.address);
  // console.log('balanceOf test:', bal.toString() === '1');

  // const mktPlace = await deployments.get('MarketPlace');
  // const mktPlaceContract = new ethers.Contract(
  //   mktPlace.address,
  //   mktPlace.abi,
  //   dummy
  // );
  // tx = await nftContract.connect(dummy).approve(mktPlace.address, tokenId);
  // await tx.wait;
  // console.log(`\ntoken ${tokenId} approved to mktPlace`);
  // tx = await mktPlaceContract.lendNFT(nft.address, tokenId, 1000, 150);
  // await tx.wait();
  // console.log(`\ntoken ${tokenId} listed: fee=1000; duration=150 `);

  // const assets = await mktPlaceContract.getAssets(dummy.address);
  // console.log('getAssets test:');
  // console.log(
  //   'lender:', assets[0].lender === dummy.address,
  //   'contract:', assets[0].contract_ === nft.address,
  //   'id:', assets[0].id.eq(tokenId),
  //   'fee:', assets[0].fee.toString() === '1000',
  //   'duration', assets[0].duration.toString() === '150'
  // );
  



};
module.exports.default = func;
func.tags = [];
