import { BigNumber, ethers } from "ethers";
import { UserOperationBuilder, Client } from "userop";
import uri from "../nft/uri.json";
import dotenv from "dotenv";
import nft from "../deployments/sepolia/TestNFT.json"
import vsa from "../artifacts/contracts/SmartAccount.sol/SmartAccount.json";
import entrypoint from "../artifacts/contracts/mock/EntryPoint.sol/EntryPoint.json";
// import mktplace from '../deployments/base_goerli/MarketPlace.json';
// import receipts from '../deployments/base_goerli/ReceiptNFT.json';
import { arrayify } from "ethers/lib/utils";


dotenv.config({ path: __dirname+'/../.env' });

// const networkID = 84531;
// const networkID = 80001 // mumbai
const networkID = 11155111 // sepolia
const pkey = process.env.PRIVATE_KEY;
// const apikey = process.env.MUMBAI_ALCHEMY_API_KEY;
const apikey = process.env.SEPOLIA_ALCHEMY_API_KEY;
const dummy = process.env.DUMMY_ADDR;
// const rpc = process.env.BASE_GOERLI_PROVIDER;
const walletAddress = "0x088F73ADf40B43c74aEd612FC14186A9d44e7Cce";
const walletSignerKey = process.env.WALLET_SIGNER_KEY;
const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // mumbai, baseGoerli, sepolia
const bundler = process.env.BUNDLER_API;
const walletSignerAddr = process.env.WALLET_SIGNER_ADDR;
// const provider = new ethers.providers.AlchemyProvider(networkID, apikey);
const provider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${apikey}`);

const checkSupply = async () => {
    const contract  = new ethers.Contract(nft.address, nft.abi, provider);
    console.log('supply', (await contract.totalSupply()).toString())
}
// checkSupply();

const getOwner = async() => {
    const contract  = new ethers.Contract(nft.address, nft.abi, provider);
    // 
    const tokenId = 1;
    // 
    const owner = await contract.ownerOf(tokenId);
    console.log('owner', owner);
    console.log('address',nft.address)
}
// getOwner()

const test = async () => {
    // const bytecode = await provider.getCode(entryPointAddress);
    // console.log(bytecode == entrypoint.bytecode);
    const gasData = await provider.getGasPrice();
    console.log(gasData.toString());
}

const checkBal = async () => {
    if(!pkey) throw new Error('missing env');
    if(!walletSignerAddr) throw new Error('missing signer');
    // const provider = new ethers.providers.InfuraProvider(network, apikey);
    // const signer = new ethers.Wallet(pkey, provider);
    // console.log(signer.address);
    // const bal = (await signer.getBalance()).toString();
    // const bal = await provider.getBalance(walletSignerAddr);
    const bal = await provider.getBalance('0x49e75CB7Ff22F1B4E41f382cA4B5e6D349dDDc36');
    console.log(ethers.utils.formatEther(bal));
}
// checkBal();


const mint = async () => {
    if(!pkey || !apikey) throw new Error("missing env");
    // const provider = new ethers.providers.JsonRpcProvider(rpc);
    const signer = new ethers.Wallet(pkey, provider);
    const contract = new ethers.Contract(nft.address, nft.abi, signer);
    console.log('contract address', contract.address);

    const tokenId = await contract.totalSupply();
    console.log(`\nminting token ${tokenId} ...`);
    // 
    const to = await signer.getAddress();
    // 
    const mint = await contract.safeMint(to, uri.millfalcon);
    const receipt = await mint.wait();
    console.log(receipt);

    console.log(`\ntoken ${tokenId} minted to ${to} `);

    console.log('\nchecking owner...')
    const owner = await contract.ownerOf(tokenId);
    console.log('owner == wallet : ',owner == to);
}
mint();


const PKEY_2 = process.env.PRIVATE_KEY_2;
// const eoaTransfer = async (tokenId: number) =>{
//     if(!pkey ) throw new Error("missing env");
//     const signer = new ethers.Wallet(pkey, provider);
//     // 
//     const contract = new ethers.Contract(receipts.address, receipts.abi, signer); // RECEIPTS
//     // const contract = new ethers.Contract(nft.address, nft.abi, signer); // NFT
//     // 
//     const recipient = '0x8957dBa32B08B904677F6c99994c88d6D39704Ca';
//     // 
//     console.log(`\nsending token ${tokenId.toString()} to ${recipient} ... `);

//     const tx = await contract.transferFrom(signer.address, recipient, tokenId);
//     console.log(await tx.wait());

//     console.log('\nchecking new owner... ');
//     const newOwner = await contract.ownerOf(tokenId);
//     console.log('new owner == recipient', newOwner == recipient);
    
// }
// eoaTransfer(18);

// const batchEOAtransfer = async(nZero: number, n: number) => {
//     let i;
//     for(i=nZero; i<=n; i++ ) {
//         await eoaTransfer(i);
//     }
// }

// batchEOAtransfer(2, 9);

const transfer = async () => {
    if(!walletSignerKey || !dummy || !bundler) throw new Error("missing env");
    const signer = new ethers.Wallet(walletSignerKey, provider);
    const account = new ethers.Contract(walletAddress, vsa.abi, signer);
    const accountAbi = new ethers.utils.Interface(vsa.abi);
    console.log('flag 0');
    const epAbi = ["function getUserOpHash(UserOperation calldata userOp)"];
    const entryPoint = new ethers.Contract(entryPointAddress, entrypoint.abi, provider);
    // 
    const recipient = dummy; 
    // 
    const tokenId = 0;
    //

    const nonce = await account.getNonce();
    // 
    console.log('flag 1')
    // 
    const abi = [
        "function safeTransferFrom(address from,address to,uint256 tokenId)"
    ]
    const iface = new ethers.utils.Interface(abi);
    const calldata_ = iface.encodeFunctionData("safeTransferFrom", [
        walletAddress,
        recipient,
        tokenId            
    ]);
    // 
    console.log('flag 2')
    // 

    const callGasLimit = await provider.estimateGas({
        to: nft.address,
        value: BigNumber.from(0),
        data:calldata_
    });
    // 
    console.log('flag 3')
    // 
    const gasPrice = await provider.getGasPrice();

    const client = await Client.init(bundler, {entryPoint: entryPointAddress});

    const builder = new UserOperationBuilder()
     .setSender(walletAddress)
     .setNonce(nonce)
     .setCallData(
        accountAbi.encodeFunctionData("execute", [
            nft.address,
            ethers.constants.Zero,
            calldata_
        ]))
     .setCallGasLimit(callGasLimit)
     .setVerificationGasLimit(150000n)
     .setPreVerificationGas(51000)
     .setMaxFeePerGas(gasPrice)
     .setMaxPriorityFeePerGas(gasPrice);

    // 
    console.log('flag 4')
    // 

    // let userOp = {
    //     sender: walletAddress,
    //     nonce: nonce,
    //     calldata: accountAbi.encodeFunctionData("execute", [
    //         nft.address,
    //         ethers.constants.Zero,
    //         calldata_
    //     ]),
    //     callGasLimit: callGasLimit,
    //     verificationGasLimit: 150000,
    //     maxFeePerGas: gasPrice,
    //     maxPriorityFeePerGas: gasPrice,
    // }
    // 
    const userOp = builder.getOp();
    // console.log(userOp);
    
    console.log('flag 5')
    // 

    const userOpHash = await entryPoint.getUserOpHash(userOp);
    // 
    console.log('flag 5.5')
    // 
    const signature = await signer.signMessage(arrayify(userOpHash));

    builder.setSignature(signature);
    // 
    console.log('flag 6')
    // 
    console.log(`\ntransfering ${ tokenId} to ${recipient} ...`);
    
    builder.buildOp(entryPointAddress, networkID)
    const response = await client.sendUserOperation(builder);
    const userOperationEvent = await response.wait();
    console.log(userOperationEvent);
    // const tx = await account.execute(nft.address, 0, calldata_ );
    // const receipt = await tx.wait();
    // console.log(receipt);

    console.log('\nchecking new owner...');
    const contract = new ethers.Contract(nft.address, nft.abi, provider);
    const newOwner = await contract.ownerOf(tokenId);
    console.log('new owner == recipient', newOwner == recipient); 
}

const WALLET_ADDR = '0x8957dBa32B08B904677F6c99994c88d6D39704Ca';
const test2 = async() => {
    const wallet = new ethers.Contract(WALLET_ADDR, vsa.abi, provider );
    const index = await wallet.getTokenIndex(nft.address, 0);
    const rentals = await wallet.getRentals();
    console.log('lender', rentals[index].lender);
    // console.log(mktplace.address)
}
// test2();


// checkBal();
// eoaTransfer();
// transfer();
