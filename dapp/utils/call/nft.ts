import { BigNumber, ethers } from 'ethers';
import erc721 from '../contractData/ERC721.artifact.json';

const erc721abi = erc721.abi as any;

// TODO: (APPROVE FOR ALL??????)
export const approve = async (
    signer: ethers.providers.JsonRpcSigner,
    contractAddr: string,
    tokenId: BigNumber,
    to: string 
) => {
    const contract = new ethers.Contract(contractAddr, erc721abi, signer);
    const tx = await contract.approve(to, tokenId);
    return tx.wait();
}