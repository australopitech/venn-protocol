import { encodeFunctionData } from "viem";
import { mktPlaceContract } from "../contractData";
import { PublicClient, Abi, WalletClient } from "viem";
import { NftObj } from "@/types";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { SmartAccountProvider } from "@alchemy/aa-core";

const success_msg = "tx successfull!!";
const mktPlaceAddr = mktPlaceContract.address as `0x${string}`;
const mktPlaceAbi = mktPlaceContract.abi;

/** VSA CALLERS */
export const vsaPull = async (
    mktPlaceAddress: `0x${string}`,
    contract: `0x${string}`,
    tokenId: bigint,
    provider?: AlchemyProvider | SmartAccountProvider
) => {
    if(!provider)
        throw new Error('provider undefined');
    const res = await provider.sendUserOperation({
        target: mktPlaceAddress,
        value: 0n,
        data: pullCallData(
            contract,
            tokenId
        )
    });
    return await provider.waitForUserOperationTransaction(res.hash);
}


/** EOA CALLERS */

export const list = async (
    client: PublicClient | undefined,
    signer: WalletClient | undefined,
    nftContractAddr: string,
    tokenId: bigint,
    price: bigint,
    maxDuration: bigint
) => {
    if(!client)
        throw new Error('client undefined')
    if(!signer)
        throw new Error('signer undefined');
    const account = signer.account;
    const { request } = await client.simulateContract({
        account,
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'listNFT',
        args: [nftContractAddr, tokenId, price, maxDuration]
    });
    const hash = await signer.writeContract(request);
    await client.waitForTransactionReceipt({ hash });
    return hash;
}

export const delist = async (
    receiptId: bigint,
    client?: PublicClient,
    signer?: WalletClient,
) => {
    if(!client)
        throw new Error('client undefined');
    if(!signer)
        throw new Error('signer undefined');
    const nftObj = await client.readContract({
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'getNFTbyReceipt',
        args: [receiptId]
    }) as NftObj;
    const account = signer.account;
    const { request } = await client.simulateContract({
        account,
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'deList',
        args: [nftObj.contractAddress, nftObj.tokenId]
    });
    const hash = await signer.writeContract(request);
    await client.waitForTransactionReceipt({ hash });
    return hash
}

export const pull = async (
    receiptId: bigint,
    client?: PublicClient,
    signer?: WalletClient,
) => {
    if(!client)
        throw new Error('client undefined');
    if(!signer)
        throw new Error('signer undefined');
    const nftObj = await client.readContract({
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'getNFTbyReceipt',
        args: [receiptId]
    }) as NftObj;
    const account = signer.account;
    const { request } = await client.simulateContract({
        account,
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'pullAsset',
        args: [
            nftObj.contractAddress,
            nftObj.tokenId
        ]
    });
    const hash = await signer.writeContract(request);
    client.waitForTransactionReceipt({ hash });
    return hash
}

/**not used */
export const rent = async (
    signer: WalletClient | undefined,
    nftContractAddr: string,
    tokenId: bigint,
    duration: number,
    value: bigint,
    client?: PublicClient
) => {
    if(!client)
        throw new Error('client undedined');
    if(!signer)
        throw new Error('signer undefined');
    const account = signer.account;
    const { request } = await client.simulateContract({
        account,
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'rentNFT',
        args: [nftContractAddr, tokenId, duration],
        value: value
    });
    return await signer.writeContract(request);
}

/**UTILS */
export function rentCallData (
    contract: `0x${string}`,
    tokenId: bigint,
    duration: number
  ) {
    return encodeFunctionData({
      abi: mktPlaceAbi,
      functionName: 'rentNFT',
      args: [
        contract,
        tokenId,
        duration
      ]
    });
  }

export function listCallData (
    contract: `0x${string}`,
    tokenId: bigint,
    price: bigint,
    maxDuration: number | bigint
) {
    return encodeFunctionData({
        abi: mktPlaceAbi,
        functionName: 'listNFT',
        args: [
            contract,
            tokenId,
            price,
            maxDuration
        ]
    });
}

export function delistCallData (
    contract: `0x${string}`,
    tokenId: bigint,
) {
    return encodeFunctionData({
        abi: mktPlaceAbi,
        functionName: 'deList',
        args: [
            contract,
            tokenId
        ]
    });
}

export function pullCallData (
    contract: `0x${string}`,
    tokenId: bigint
) {
    return encodeFunctionData({
        abi: mktPlaceAbi,
        functionName: 'pullAsset',
        args: [
            contract,
            tokenId
        ]
    });
}

export function resolvePullOrDelistCallData (
    method: 'delist' | 'pull',
    contract: string,
    tokenId: bigint
) {
    const ret = method === 'delist' ? delistCallData(
        contract as `0x${string}`, 
        tokenId
      ) : method === 'pull' ? pullCallData(
        contract as `0x${string}`,
        tokenId
      ) : undefined
    if(!ret)
        throw new Error('unsuported method');
    return ret
}