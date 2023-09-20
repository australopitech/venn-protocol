import { BigNumber, ethers } from "ethers";
import mktPlaceData from "../contractData/MarketPlace.json";

const success_msg = "tx successfull!!";

export const list = async (
    signer: any | undefined,
    nftContractAddr: string,
    tokenId: BigNumber,
    price: BigNumber,
    maxDuration: BigNumber
) => {
    if(!signer) {
        console.log('signer undefined');
        alert('Connect your wallet');
        return
    }
    const mktPlace = new ethers.Contract(mktPlaceData.address, mktPlaceData.abi, signer);
    const tx = await mktPlace.listNFT(nftContractAddr, tokenId, price, maxDuration);
    return await tx.wait();
}

export const delist = async (
    signer: any | undefined,
    receiptId: BigNumber,
) => {
    if(!signer) {
        console.log('signer undefined');
        alert('Connect your wallet');
        return
    }
    const mktPlace = new ethers.Contract(mktPlaceData.address, mktPlaceData.abi, signer);
    const nftObj = await mktPlace.getNFTbyReceipt(BigNumber.from(receiptId));
    // console.log('nftObj', nftObj)
    const tx = await mktPlace.deList(nftObj.contractAddress, nftObj.tokenId);
    return await tx.wait();
}

export const pull = async (
    receiptId: number,
    signer?: any
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
        console.log('error: signer undefined');
        return
    }
    const mktPlace = new ethers.Contract(mktPlaceData.address, mktPlaceData.abi, signer);
    const tx = await mktPlace.rentNFT(nftContractAddr, tokenId, duration, {value: value});
    return await tx.wait();    
}