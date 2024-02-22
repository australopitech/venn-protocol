// import { BigNumber, ethers } from 'ethers';
import { PublicClient, WalletClient, encodeFunctionData } from 'viem';
import { erc721abi } from '../contractData';

/**EOA Call */
export async function approve (
    client: PublicClient,
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
    const { request } = await client.simulateContract({
        account,
        address,
        abi: erc721abi,
        functionName: 'approve',
        args: [to, tokenId]
    });
    const hash = await signer.writeContract(request);
    await client.waitForTransactionReceipt({ hash });
    return hash;
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