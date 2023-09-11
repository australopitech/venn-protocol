import { ethers } from 'ethers';
import erc721 from '../contractData/ERC721.json';

const erc721abi = erc721.abi as any;

// TODO: APPROVE CALLER (APPROVE FOR ALL??????)
export const approve = async (
    signer: ethers.providers.JsonRpcSigner,
    contractAddr: string,
    tokenId: number,
    to: string 
) => {
        const contract = new ethers.Contract(contractAddr, erc721abi, signer);
        let error = null;
        let receipt;
        try {
            const tx = await contract.approve(to, tokenId);
            receipt = tx.wait();
            console.log(receipt);
        } catch (err) {
            error = err;
            console.log(err);
        }
}