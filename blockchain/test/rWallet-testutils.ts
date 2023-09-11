import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { RWalletFactory__factory, RWalletFactory, RWallet,
    NFT__factory, MarketPlace__factory, MarketPlace, ReceiptNFT, ReceiptNFT__factory, NFT } from "../typechain";
import { expect } from "chai";
import * as walletData from "../artifacts/contracts/wallet/RWallet.sol/RWallet.json"
import { BigNumber } from "ethers";

const provider = ethers.provider;

export const deployFactory = async (signer: SignerWithAddress, entryPoint: string) => {
    console.log('\nDeploying factory contract...');
    const factoryFactory = new RWalletFactory__factory(signer);
    const factory = await factoryFactory.deploy(entryPoint);
    await factory.deployTransaction.wait();
    console.log(`\nWalletFactory deployed to address ${factory.address}\n`);
    return factory;    
}

export const nftDeployAndMint = async (signer: SignerWithAddress, mintTo: string) => {
    const nftFactory = new NFT__factory(signer);
    const nftContract = await nftFactory.deploy();
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
    feeBase: number,
    feeMultiplier: number,
    pullFeeBase:number,
    pullFeeMultiplier: number
) => {
    console.log('\ndeploying MarketPlace...')
    const mktPlaceFactory = new MarketPlace__factory(signer);
    const mktPlace = await mktPlaceFactory.deploy(
        factoryAddress,
        receiptsAddress,
        feeBase,
        feeMultiplier,
        pullFeeBase,
        pullFeeMultiplier,
        signer.address
    );
    await mktPlace.deployTransaction.wait();
    console.log(`\nMarketPlace deployed at ${mktPlace.address}`);
    return mktPlace;
}

export const deployReceiptsContract = async (signer: SignerWithAddress) => {
    console.log("\ndeploying receipts contract...");
    const factory = new ReceiptNFT__factory(signer);
    const receiptContract = await factory.deploy();
    console.log(`\nreceipts contract deployed at ${receiptContract.address}`);
    return receiptContract;
}

export const createWallet = async (factory: RWalletFactory, ownerAddress: string) => {
    const salt = 2;
    const newAccountTx = await factory.createAccount(ownerAddress, salt);
    const newAccountReceipt = await newAccountTx.wait();
    const newAccountEvent = newAccountReceipt.events?.find(
            (event: any) => event.event === 'WalletCreated'
    );
    const walletAddress = newAccountEvent?.args?.account;
    const wallet = new ethers.Contract(walletAddress, walletData.abi, provider) as RWallet;
    return wallet;
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
    wallet: RWallet,
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

    const feeBase = await mktPlace.feeBase();
    const feeMul = await mktPlace.feeMultiplier();
    const fee = (price*duration*feeMul) / feeBase;
    const value = BigNumber.from(price*duration + fee).add(ethers.utils.parseEther('0.05'));
    const fund = await owner.sendTransaction({to: wallet.address, value: value })
    await fund.wait();
    const tx = await wallet.connect(owner).execute(mktPlace.address, value, calldata_);
    await tx.wait();
    return tx;
}