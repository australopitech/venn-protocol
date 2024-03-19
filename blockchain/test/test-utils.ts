import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { SmartAccountFactory__factory, SmartAccountFactory, SmartAccount,
    NFT__factory, MarketPlace__factory, MarketPlace, ReceiptNFT, ReceiptNFT__factory, NFT, EntryPoint__factory } from "../typechain";
import { expect } from "chai";
import * as accountData from "../artifacts/contracts/SmartAccount.sol/SmartAccount.json";
import { BigNumber } from "ethers";

const provider = ethers.provider;

export const deployEntryPoint = async (signer: SignerWithAddress) => {
    console.log('deploying EntryPoint contract...');
    const fac = new EntryPoint__factory(signer);
    const ep = await fac.deploy();
    await ep.deployTransaction.wait();
    console.log(`\nEntryPoint deployed at ${ep.address}`);
    return ep
}

export const deployFactory = async (signer: SignerWithAddress, entryPoint: string) => {
    console.log('\nDeploying factory contract...');
    const fac = new SmartAccountFactory__factory(signer);
    const factory = await fac.deploy(entryPoint);
    await factory.deployTransaction.wait();
    console.log(`\naccountFactory deployed to address ${factory.address}\n`);
    return factory;    
}

export const nftDeployAndMint = async (signer: SignerWithAddress, mintTo: string) => {
    const fac = new NFT__factory(signer);
    const nftContract = await fac.deploy();
    await nftContract.deployTransaction.wait();
    console.log(`\nnftContract deployed at ${nftContract.address}\n`);
    const mintTx = await nftContract.connect(signer).safeMint(mintTo, "uri");
    const mintReceipt = await mintTx.wait();
    const mintEvent = mintReceipt.events?.find(
        (event: any) => event.event === 'Transfer'
    );
    const tokenId = mintEvent?.args?.tokenId;
    console.log(`\nnft ${tokenId} minted to ${mintTo}\n`);
    return [nftContract, tokenId];
}

export const mint = async (contract: NFT, owner: SignerWithAddress, mintTo: string) : Promise<BigNumber> => {
    const mintTx = await contract.connect(owner).safeMint(mintTo, "uri");
    const mintReceipt = await mintTx.wait();
    const mintEvent = mintReceipt.events?.find(
            (event: any) => event.event === 'Transfer'
        );
    const token = mintEvent?.args?.tokenId;
    expect(await contract.ownerOf(token)).to.eq(mintTo);
    console.log(`\nnft ${token} minted to ${mintTo}\n`);
    return token;
}

export const deployMktPlace = async (
    signer: SignerWithAddress,
    factoryAddress: string,
    receiptsAddress: string,
    servAliq: number,
    pullAliq: number,
) => {
    console.log('\ndeploying MarketPlace...')
    const fac = new MarketPlace__factory(signer);
    const mktPlace = await fac.deploy(
        factoryAddress,
        receiptsAddress,
        servAliq,
        pullAliq,
        signer.address
    );
    await mktPlace.deployTransaction.wait();
    console.log(`\nMarketPlace deployed at ${mktPlace.address}`);
    return mktPlace;
}

export const deployReceiptsContract = async (signer: SignerWithAddress) => {
    console.log("\ndeploying receipts contract...");
    const fac = new ReceiptNFT__factory(signer);
    const receiptContract = await fac.deploy();
    console.log(`\nreceipts contract deployed at ${receiptContract.address}`);
    return receiptContract;
}

export const createAccount = async (factory: SmartAccountFactory, ownerAddress: string) => {
    const salt = 2;
    const newAccountTx = await factory.createAccount(ownerAddress, salt);
    const newAccountReceipt = await newAccountTx.wait();
    const newAccountEvent = newAccountReceipt.events?.find(
            (event: any) => event.event === 'SmartAccountCreated'
    );
    const accountAddress = newAccountEvent?.args?.account;
    const account = new ethers.Contract(accountAddress, accountData.abi, provider) as SmartAccount;
    return account;
}

export const listNFT = async (
    signer: SignerWithAddress, 
    mktPlace: MarketPlace,
    nftContract: NFT,
    tokenId: BigNumber,
    price: number,
    maxDuration: number
) => {
    const approve = await nftContract.connect(signer).approve(mktPlace.address, tokenId);
    await approve.wait();
    const tx = await mktPlace.connect(signer).listNFT(nftContract.address, tokenId, price, maxDuration);
    await tx.wait();
    return tx;
}

export const rentNFT = async (
    account: SmartAccount,
    owner: SignerWithAddress,
    mktPlace: MarketPlace,
    nftAddr: string,
    tokenId: BigNumber,
    duration: number,
    price: number
) => {
    
    let abi= [
        "function rentNFT (address contract_, uint256 tokenId, uint256 duration)"
    ];
    let iface = new ethers.utils.Interface(abi);
    const calldata_ = iface.encodeFunctionData("rentNFT", [
        nftAddr,
        tokenId,
        duration
    ]);
    // console.log(calldata_);

    const servAliq = await mktPlace.serviceAliquot();
    const fee = (price*duration*servAliq) / 10000;
    const value = BigNumber.from(price*duration + fee).add(ethers.utils.parseEther('0.05'));
    const fund = await owner.sendTransaction({to: account.address, value: value })
    await fund.wait();
    const tx = await account.connect(owner).execute(mktPlace.address, value, calldata_);
    // await tx.wait();
    return await tx.wait();
}