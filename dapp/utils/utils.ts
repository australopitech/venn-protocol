import { ethers, BigNumber } from "ethers";
import erc721 from "./contractData/ERC721.artifact.json";
import mktplace from "./contractData/MarketPlace.json";

const erc721abi = erc721.abi as any;

export const isApproved = async (
    provider: any,
    contractAddr: string,
    tokenId: number,
    tokenOwner: string,
    to: string
) => {
    const contract = new ethers.Contract(contractAddr, erc721abi, provider);
    let approved = null
    let isOperator= null;
    try {
        approved = await contract.getApproved(tokenId);
        isOperator = await contract.isApprovedForAll(tokenOwner, to)
    } catch (err) {
        console.log(err);
    }
    if(!approved && !isOperator ) return null;
    return (approved == mktplace.address || isOperator);
}

export const isListed = async (
    provider: any,
    nftContractAddr: string,
    tokenId: number
) => {
    const contract = new ethers.Contract(mktplace.address, mktplace.abi, provider);
    console.log(contract);
    let maxDuration;
    try {
        maxDuration = await contract.getMaxDuration(nftContractAddr, tokenId);
        console.log('maxDuration', maxDuration);
    } catch (error) {
        console.log(error)
    }
    if(maxDuration) return (maxDuration > 0);
}

export const ownerOf = async (
    provider: any,
    nftContractAddr: string,
    tokenId: BigNumber
) => {
    const contract = new ethers.Contract(nftContractAddr, erc721.abi, provider);
    return await contract.ownerOf(tokenId);
    
}