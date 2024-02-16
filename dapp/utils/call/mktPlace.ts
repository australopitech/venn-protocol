import { encodeFunctionData } from "viem";
import { mktPlaceContract } from "../contractData";
import { PublicClient, Abi, WalletClient } from "viem";
import { NftObj } from "@/types";

const success_msg = "tx successfull!!";
const mktPlaceAddr = mktPlaceContract.address as `0x${string}`;
const mktPlaceAbi = mktPlaceContract.abi;

export const list = async (
    provider: PublicClient | undefined,
    signer: WalletClient | undefined,
    nftContractAddr: string,
    tokenId: bigint,
    price: bigint,
    maxDuration: bigint
) => {
    if(!provider) {
        console.error('no provider found');
        return
    }
    if(!signer) {
        console.error('signer undefined');
        alert('Connect your wallet');
        return
    }
    const account = signer.account;
    const { request } = await provider.simulateContract({
        account,
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'listNFT',
        args: [nftContractAddr, tokenId, price, maxDuration]
    });
    return await signer.writeContract(request);
}

export const delist = async (
    provider: PublicClient | undefined,
    signer: WalletClient | undefined,
    receiptId: bigint,
) => {
    if(!provider) {
        console.error('no provider found');
        return
    }
    if(!signer) {
        console.error('signer undefined');
        alert('Connect your wallet');
        return
    }
    // const mktPlace = new ethers.Contract(mktPlaceContract.address, mktPlaceContract.abi, signer);
    // const nftObj = await mktPlace.getNFTbyReceipt(receiptId);
    const nftObj = await provider.readContract({
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'getNFTbyReceipt',
        args: [receiptId]
    }) as NftObj;
    // console.log('nftObj', nftObj)
    // const tx = await mktPlace.deList(nftObj.contractAddress, nftObj.tokenId);
    const account = signer.account;
    const { request } = await provider.simulateContract({
        account,
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'listNFT',
        args: [nftObj.contractAddress, nftObj.tokenId]
    });
    return await signer.writeContract(request);
}

export const pull = async (
    receiptId: number,
    signer?: WalletClient,
    provider?: PublicClient
) => {
    if(!provider) {
        console.error('no provider found');
        return
    }
    if(!signer) {
        console.log('signer undefined');
        alert('Connect your wallet');
        return
    }
    // const mktPlace = new ethers.Contract(mktPlaceContract.address, mktPlaceContract.abi, signer);
    let error = null;
    let receipt;
    try {
        // const tx = await mktPlace.pullAsset(receiptId);
        // receipt = await tx.wait();
        // console.log(receipt);
        const account = signer.account;
        const { request } = await provider.simulateContract({
            account,
            address: mktPlaceAddr,
            abi: mktPlaceAbi,
            functionName: 'pullAsset',
            args: [receiptId]
        });
        return await signer.writeContract(request);
    } catch (err) {
        // error = err;
        console.error(err);
    } 
    // if(!error) {
    //     console.log('success');
    //     console.log('tx hash', receipt?.transactionHash);
    //     alert(success_msg);
    // }
}

export const rent = async (
    signer: WalletClient | undefined,
    nftContractAddr: string,
    tokenId: bigint,
    duration: number,
    value: bigint,
    provider?: PublicClient
) => {
    if(!provider) {
        console.error('no provider found');
        return
    }
    if(!signer) {
        console.log('error: signer undefined');
        return
    }
    const account = signer.account;
    const { request } = await provider.simulateContract({
        account,
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'rentNFT',
        args: [nftContractAddr, tokenId, duration],
        value: value
    });
    return await signer.writeContract(request);
    // const mktPlace = new ethers.Contract(mktPlaceContract.address, mktPlaceContract.abi, signer);
    // const tx = await mktPlace.rentNFT(nftContractAddr, tokenId, duration, {value: value});
    // return await tx.wait();    
}

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
    })
  }

export function listCallData (
    contract: `0x${string}`,
    tokenId: bigint,
    price: bigint,
    maxDuration: number
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
    })
}