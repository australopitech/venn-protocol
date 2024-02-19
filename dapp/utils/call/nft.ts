// import { BigNumber, ethers } from 'ethers';
import { PublicClient, WalletClient, encodeFunctionData } from 'viem';
import { erc721abi } from '../contractData';

// const erc721abi = erc721.abi as any;

// TODO: (APPROVE FOR ALL??????)
export async function approve (
    provider: PublicClient,
    signer: WalletClient,
    contractAddr: string,
    tokenId: bigint,
    to: string
) {
    // const contract = new ethers.Contract(contractAddr, erc721abi, signer);
    // const tx = await contract.approve(to, tokenId);
    // return tx.wait();
    const account = signer.account;
    const address = contractAddr as `0x${string}`;
    const { request } = await provider.simulateContract({
        account,
        address,
        abi: erc721abi,
        functionName: 'approve',
        args: [to, tokenId]
    });
    return signer.writeContract(request);
}

export function approveCallData (
    to: string,
    tokenId: bigint
) {
    return encodeFunctionData({
        abi: erc721abi,
        functionName: 'approve',
        args: [ 
            to,
            tokenId
        ]
    })
}