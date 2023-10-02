import { ethers } from "ethers";
import { UserOperationBuilder, Client } from "userop";
import mktplace from "../deployments/base_goerli/MarketPlace.json";
import nft from "../deployments/base_goerli/NFT.json";
import walletAbi from "../artifacts/contracts/wallet/RWallet.sol/RWallet.json";
import entryPoint from "../artifacts/contracts/core/EntryPoint.sol/EntryPoint.json";
import dotenv from "dotenv";
import { BigNumber } from "ethers";
import { arrayify } from "ethers/lib/utils";

dotenv.config();

const oldestMktPlaceAddr = '0xD2cB0110eF568f90d974DDf233090dEe67cdcd60';
const oldMktPlaceAddr = '0x3e0D0130FA29D49068804A5e4643506BaD2Df288';
const NFT_ADDRESS = process.env.NFT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC = process.env.BASE_GOERLI_PROVIDER;
const provider = new ethers.providers.JsonRpcProvider(RPC);

const deList = async() => {
    if(!provider || !PRIVATE_KEY || !NFT_ADDRESS) throw new Error('missing env');
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const mktPlaceContract = new ethers.Contract(oldMktPlaceAddr, mktplace.abi, signer);

    const tokenId = 2;
    const tx = await mktPlaceContract.deList(NFT_ADDRESS, tokenId);

    console.log(await tx.wait());
    console.log("\nchecking new owner...");
    const nftContract = new ethers.Contract(NFT_ADDRESS, nft.abi, provider);
    const newOwner = await nftContract.ownerOf(tokenId);
    console.log(`owner == signer?`, newOwner === signer.address );
} 

// deList();

const getNFTByReceipt = async() => {
    const mktPlaceContract = new ethers.Contract(mktplace.address, mktplace.abi, provider);
    // console.log('test', mktPlaceContract.address)
    const receiptId = 23;
    const nftObj = await mktPlaceContract.getNFTbyReceipt(receiptId);
    console.log(`tokenId: ${nftObj.tokenId.toString()}`);
    console.log('contract address', nftObj.contractAddress);
    // console.log('fee', await mktPlaceContract.serviceAliquot());
}

// getNFTByReceipt();

const getListData = async() => {
    if(!provider) throw new Error('missing env')
    const mktPlaceContract = new ethers.Contract(mktplace.address, mktplace.abi, provider);
    // 
    const tokenId = 6;
        // 
    const maxDur = await mktPlaceContract.getMaxDuration(NFT_ADDRESS, tokenId);
    console.log('maxDuration' , maxDur.toString());
    const price = await mktPlaceContract.getPrice(nft.address, tokenId);
    console.log('price', price.toString());
}

// getListData();




const WALLET_SIGNER_KEY = process.env.WALLET_SIGNER_KEY;
const WALLET_ADDR = process.env.WALLET_ADDR;
const BUNDLER_API = process.env.BUNDLER_API;
const ENTRY_POINT_STACKUP =  process.env.ENTRY_POINT_STACKUP;
const networkID = 84531;

const rent = async () => {
    
    if(!WALLET_SIGNER_KEY || !BUNDLER_API || !ENTRY_POINT_STACKUP || !WALLET_ADDR) 
      throw new Error("missing env");

    const signer = new ethers.Wallet(WALLET_SIGNER_KEY, provider);
    const account = new ethers.Contract(WALLET_ADDR, walletAbi.abi, signer);
    const accountAbi = new ethers.utils.Interface(walletAbi.abi);
    // console.log('flag 0');
    // const epAbi = ["function getUserOpHash(UserOperation calldata userOp)"];
    const ep = new ethers.Contract(ENTRY_POINT_STACKUP, entryPoint.abi, provider);
    // 
    // const target = mktplace.address; 
    // 
    // 4
    const tokenId = 6 ;
    //

    const nonce = await account.getNonce();
    // 
    // console.log('flag 1')
    // 
    const abi = [
        "function rentNFT(address contract_,uint256 tokenId,uint256 duration)"
    ]
    const iface = new ethers.utils.Interface(abi);
    
    const calldata_ = iface.encodeFunctionData("rentNFT", [
        nft.address,
        tokenId,
        1       
    ]);
    //

    const mktPlaceContract = new ethers.Contract(mktplace.address, mktplace.abi, provider);
    const price = await mktPlaceContract.getPrice(nft.address, tokenId);
    const maxDur = await mktPlaceContract.getMaxDuration(nft.address, tokenId);
    const aliq = await mktPlaceContract.serviceAliquot();
    const duration = maxDur.sub(1);
    const rent = price.mul(duration);
    const fee = rent.mul(aliq).div(10000);
  

    const callGasLimit = await provider.estimateGas({
        to: mktplace.address,
        // value: BigNumber.from(0),
        value: rent.add(fee),
        data:calldata_
    });
    // 
    // console.log('flag 3')
    // 
    const gasPrice = await provider.getGasPrice();

    const client = await Client.init(BUNDLER_API, {entryPoint: ENTRY_POINT_STACKUP});

    const builder = new UserOperationBuilder()
     .setSender(WALLET_ADDR)
     .setNonce(nonce)
     .setCallData(
        accountAbi.encodeFunctionData("execute", [
            mktplace.address,
            // ethers.constants.Zero,
            rent.add(fee),
            calldata_
        ]))
     .setCallGasLimit(callGasLimit)
     .setVerificationGasLimit(150000n)
     .setPreVerificationGas(51000)
     .setMaxFeePerGas(gasPrice)
     .setMaxPriorityFeePerGas(gasPrice);

//     // 
//     console.log('flag 4')
//     // 

    const userOp = builder.getOp();
    // console.log(userOp);
    
    const userOpHash = await ep.getUserOpHash(userOp);
    // 
//     console.log('flag 5.5')
    // 
    const signature = await signer.signMessage(arrayify(userOpHash));

    builder.setSignature(signature);
//     // 
//     console.log('flag 6')
//     // 
    console.log(`\nrenting token ${ tokenId} from ${nft.address} ...`);
    
    builder.buildOp(ENTRY_POINT_STACKUP, networkID);
    const response = await client.sendUserOperation(builder);
    const userOperationEvent = await response.wait();
    console.log(userOperationEvent);

    console.log('\nchecking new owner...');
    const contract = new ethers.Contract(nft.address, nft.abi, provider);
    const newOwner = await contract.ownerOf(tokenId);
    console.log('new owner == wallet?', newOwner == WALLET_ADDR); 
}
// rent().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });

const test = () => {
    
    // console.log(ethers.utils.id("getMaxduration(address,uint256)"))
    // console.log(ethers.utils.id("getPrice(address,uint256)"))
    console.log(ethers.utils.id("getNFTbyReceipt(uint256)"));
    // console.log(ethers.utils.id("rentNFT(address,uint256,uint256)"));
    // console.log(ethers.utils.id('getPullFee(uint256)'))
    // console.log(ethers.utils.id('serviceAliquot()'))
    // console.log(ethers.utils.id('getReceipt(address,uint256)'))
    // console.log(ethers.utils.id('getBalance(address)'))
    // console.log(ethers.utils.id('isWallet(address)'))
    // console.log(ethers.utils.id('listNFT(address,uint256,uint256,uint256)'))
    // console.log(ethers.utils.id('deList(address,uint256)'))
    // console.log(ethers.utils.id('pullAsset(address,uint256)'))

    // console.log(ethers.utils.id('isWallet(address)'))
    // console.log(ethers.utils.id('isRental(address,uint256)'))

    
    // console.log(ethers.utils.id('getApproved(uint256)'))
    // console.log(ethers.utils.id("isApprovedForAll(address,address)"))
    // console.log(ethers.utils.id("ownerOf(uint256)"));
    // console.log(ethers.utils.formatEther(10040000000000));

}

test()
