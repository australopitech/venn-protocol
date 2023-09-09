import { ethers } from "ethers";
import mktPlaceData from "../contractData/"

const success_msg = "Delisting successfull!!";

const delist = async (
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

export default delist;