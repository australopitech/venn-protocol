import { ethers } from "ethers";
import mktPlaceData from "../contractData/"

const success_msg = "Rent successfull!!";

const rent = async (
    signer: any | undefined,
    nftContractAddr: string,
    tokenId: number,
    duration: number,
    value: number
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