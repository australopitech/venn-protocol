import { BigNumber, ethers } from "ethers";
import mktPlaceData from "../contractData/MarketPlace.json";

const success_msg = "tx successfull!!";

export const list = async (
    signer: any | undefined,
    nftContractAddr: string,
    tokenId: number,
    price: number,
    maxDuration: number
) => {
    if(!signer) {
        console.log('signer undefined');
        alert('Connect your wallet');
        return
    }
    const mktPlace = new ethers.Contract(mktPlaceData.address, mktPlaceData.abi, signer);
    let error = null;
    let receipt;
    console.log(nftContractAddr);
    try {
        const tx = await mktPlace.listNFT(nftContractAddr, tokenId, price, maxDuration);
        receipt = await tx.wait();
        console.log(receipt);
    } catch (err) {
        error = err;
        console.log(err);
    } if(!error) {
        console.log('success');
        console.log('tx hash', receipt?.transactionHash);
        alert(success_msg);
    }
}

export const delist = async (
    signer: any | undefined,
    nftContractAddr: string,
    tokenId: number,
) => {
    if(!signer) {
        console.log('signer undefined');
        alert('Connect your wallet');
        return
    }
    const mktPlace = new ethers.Contract(mktPlaceData.address, mktPlaceData.abi, signer);
    let error = null;
    let receipt;
    try {
        const tx = await mktPlace.deList(nftContractAddr, tokenId);
        receipt = await tx.wait();
        console.log(receipt);
    } catch (err) {
        error = err;
        console.log(err);
    } if(!error) {
        console.log('success');
        console.log('tx hash', receipt?.transactionHash);
        alert(success_msg);
    }
}

export const pull = async (
    signer: any | undefined,
    receiptId: number
) => {
    if(!signer) {
        console.log('signer undefined');
        alert('Connect your wallet');
        return
    }
    const mktPlace = new ethers.Contract(mktPlaceData.address, mktPlaceData.abi, signer);
    let error = null;
    let receipt;
    try {
        const tx = await mktPlace.pullAsset(receiptId);
        receipt = await tx.wait();
        console.log(receipt);
    } catch (err) {
        error = err;
        console.log(err);
    } if(!error) {
        console.log('success');
        console.log('tx hash', receipt?.transactionHash);
        alert(success_msg);
    }
}

export const rent = async (
    signer: any | undefined,
    nftContractAddr: string,
    tokenId: BigNumber,
    duration: BigNumber,
    value: BigNumber
) => {
    if(!signer) {
        console.log('signer undefined');
        alert('Connect your wallet');
        return
    }
    const mktPlace = new ethers.Contract(mktPlaceData.address, mktPlaceData.abi, signer);
    let error = null;
    let receipt;
    try {
        const tx = await mktPlace.rentNFT(nftContractAddr, tokenId, duration, {value: value});
        receipt = await tx.wait();
        console.log(receipt);
    } catch (err) {
        error = err;
        console.log(err);
    } if(!error) {
        console.log('success');
        console.log('tx hash', receipt?.transactionHash);
        alert(success_msg);
    }
    
}