// import { ethers, BigNumber } from "ethers";
import erc721 from "./contractData/ERC721.artifact.json";
import { mktPlaceContract, factoryContract } from "./contractData";
import { NftItem } from '@/types/typesNftApi.d';
import walletAbi from "./contractData/RWallet.artifact.json";
import { readContract } from "viem/actions";
import { createPublicClient } from "viem";
import { formatEther } from "viem";
// import { client } from '../pages/client';

interface NftObj {
    contractAddress: `0x${string}`,
    tokenId: bigint
}

const erc721abi = erc721.abi as any;
const mktPlaceAddr = mktPlaceContract.address as `0x${string}`;
const mktPlaceAbi = mktPlaceContract.abi as any;


export const isApproved = async (
    client: any,
    contractAddr: `0x${string}`,
    tokenId: bigint,
    tokenOwner: string,
    to: string
) => {
    // const contract = new ethers.Contract(contractAddr, erc721abi, client);
    let approved;
    let isOperator;
    try {
        approved = await client.readContract({
            address: contractAddr,
            abi: erc721abi,
            functionName: 'getApproved',
            args: [tokenId]
        }) as string;
        // approved = await contract.getApproved(tokenId);
        isOperator = await client.readContract({
            address: contractAddr,
            abi: erc721abi,
            functionName: 'isApprovedForAll',
            args: [tokenOwner, to]
        }) as boolean;
        // isOperator = await contract.isApprovedForAll(tokenOwner, to)
    } catch (err) {
        console.error(err);
    }
    if(!approved && isOperator === undefined ) return undefined;
    // console.log('approved', approved, 'isOperator', isOperator);
    return (approved == mktPlaceAddr || isOperator);
}

export const isListed = async (
    client: any,
    nftContractAddr: string,
    tokenId: number
) => {
    // const contract = new ethers.Contract(mktPlaceAddr, mktPlaceAbi, client);
    let maxDuration;
    try {
        // maxDuration = await contract.getMaxDuration(nftContractAddr, tokenId);
        maxDuration = await client.readContract({
            address: mktPlaceAddr,
            abi: mktPlaceAbi,
            functionName: 'getMaxDuration',
            args: [nftContractAddr, tokenId]
        }) as bigint;
        // console.log('maxDuration', maxDuration);
    } catch (error) {
        console.log(error)
    }
    if(maxDuration) return (maxDuration > 0);
}

export const ownerOf = async (
    client: any,
    nftContractAddr: string,
    tokenId: bigint
) => {
    // if(!client|| !nftContractAddr || !tokenId) return;
    // console.log('contract inside ownerOf', nftContractAddr)
    // console.log('tokenId inside ownerOf', tokenId)
    // const contract = new ethers.Contract(nftContractAddr, erc721.abi, client);
    // return await contract.ownerOf(tokenId);
    return await client.readContract({
        address: nftContractAddr as `0x${string}`,
        abi: erc721.abi,
        functionName: 'ownerOf',
        args: [tokenId]
    }) as `0x${string}`;
}

export async function isWallet(client: any, address: string) {
    // if(!client) {
    //   console.log("error: no client found");
    //   return
    // }
    // const fact = new ethers.Contract(factoryContract.address, factoryContract.abi, client );
    // const ret = await fact.isWallet(address);
    const ret = await client.readContract({
        address: factoryContract.address as `0x${string}`,
        abi: factoryContract.abi,
        functionName: 'isWallet',
        args: [address]
    }) as boolean;
    // console.log('isWallet ret', ret);
    return ret
}

export async function checkIsRental(
    client: any,
    contractAddr: string,
    tokenId: bigint,
    accountAddr?: string,
) : Promise<boolean | undefined> {
    const acc = accountAddr ?? await ownerOf(client, contractAddr, tokenId);
    const isWalletRet = await isWallet(client, acc); 
    if(isWalletRet) {
    //   const wallet = new ethers.Contract(accountAddr, walletAbi.abi, client);
    //   const ret = await wallet.isRental(contractAddr, tokenId);
      const ret = await client.readContract({
        address: acc as `0x${string}`,
        abi: walletAbi.abi,
        functionName: 'isRental',
        args: [contractAddr, tokenId]
      }) as boolean;
      console.log('isRental', ret);
      return ret
    } else if(isWalletRet === false){
      console.log('account is not a wallet');
      return false
    } else console.log('error: isWallet: no return value')
}
  
export async function getListData(
    client: any,
    nftContractAddress: string,
    tokenId: bigint
  ) {
    // if(!nftContractAddress || !tokenId)
    //     return {price: undefined, maxDur: undefined};
    // const contract = new ethers.Contract(mktPlaceAddr, mktPlaceAbi, client);
    // console.log('contract in getList', contract.address);
    // const price = await contract.getPrice(nftContractAddress, tokenId);
    const price = await client.readContract({
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'getPrice',
        args: [nftContractAddress, tokenId]
    }) as bigint;
    // const maxDur = await contract.getMaxDuration (nftContractAddress, tokenId);
    const maxDur = await client.readContract({
        address: mktPlaceAddr as `0x${string}`,
        abi: mktPlaceAbi,
        functionName: 'getMaxDuration',
        args: [nftContractAddress, tokenId]
    }) as bigint;
    // console.log('price/maxDur', price.toString(), maxDur.toString(), tokenId)
    return { price, maxDur };
}

export async function getEndTime(
    client: any, 
    account?: string, 
    nftItem?: NftItem
) {
    if(!account || !nftItem) return
    if(!nftItem.nftData.token_id) return
    // const wallet = new ethers.Contract(account, walletAbi.abi, client );
    // const rentals = await wallet.getRentals();
    const rentals = await client.readContract({
        address: account as `0x${string}`,
        abi: walletAbi.abi,
        functionName: 'getRentals',
        args: []
    }) as any[];
    const index = await client.readContract({
        address: account as `0x${string}`,
        abi: walletAbi.abi,
        functionName: 'getTokenIndex',
        args: [
            nftItem.contractAddress,
            BigInt(nftItem.nftData.token_id)
        ]
    }) as any;
    // const index = await wallet.getTokenIndex(
    //     nftItem.contractAddress,
    //     BigNumber.from(nftItem.nftData.token_id)
    // );
    if(rentals) return rentals[index].endTime as bigint;
  }
  
export async function checkIsListedByReceipt(
    client: any,
    receiptId: bigint
) {
    const nftObj = await getNFTByReceipt(client, receiptId);
    // console.log('nftObj', nftObj)
    const { maxDur } = await getListData(client, nftObj.contractAddress, nftObj.tokenId);
    // console.log('maxdur in listed', maxDur, receiptId)
    if(maxDur === undefined) {
        console.warn('error: getListData: no return value');
        return
    }
    // console.log('maxDur in check', maxDur.toString(), maxDur.gt(0));
    if(maxDur) return maxDur > 0;
  }
  
export async function getNFTByReceipt(
    client: any,
    receiptId: bigint
) {
    // const mktPlace = new ethers.Contract(mktPlaceAddr, mktPlaceAbi, client);
    // const nftObj = await mktPlace.getNFTbyReceipt(receiptId);
    return client.readContract({
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'getNFTbyReceipt',
        args: [receiptId]
    }) as unknown as NftObj ;
}

export async function resolveIsListed (
    setIsListed: any,
    isReceipt: boolean,
    contractAddr: string,
    tokenId: bigint,
    client?: any
) {
    if(isReceipt) {
        setIsListed(
          await checkIsListedByReceipt(client, tokenId)
        );
        return
    }  
    const { maxDur } : { maxDur: bigint | undefined } = await getListData(
        client,
        contractAddr,
        tokenId
    );
    if(maxDur !== undefined) 
      setIsListed(maxDur > 0);
    // console.log('maxDur in resolve', maxDur?.toString(), tokenId?.toString());
}

export async function resolveIsRentedOut(
    setIsRentedOut: any,
    contractAddress: string,
    tokenId: bigint,
    isReceipt?: boolean,
    holder?: string,
    client?: any
) {
    if(holder === mktPlaceAddr) 
        setIsRentedOut(false);
    if(isReceipt) {
        // const mktPlace = new ethers.Contract(mktPlaceAddr, mktPlaceAbi, client);
        // const nftObj = await mktPlace.getNFTbyReceipt(tokenId);
        const nftObj = await getNFTByReceipt(client, tokenId);
        // console.log('nftObj', nftObj)
        const nftHolder = await ownerOf(client, nftObj.contractAddress, nftObj.tokenId);
        // console.log('nftHolder', nftHolder)
        if(nftHolder) {
            if(nftHolder === mktPlaceAddr) setIsRentedOut(false);
            else setIsRentedOut(true);
        };
    } else if(holder) {
        const isWalletRet = await isWallet(client, holder);
        if(!isWalletRet) setIsRentedOut(false);
        else {
            const ret = await checkIsRental(client, contractAddress, tokenId, holder);
            setIsRentedOut(ret);
        }
    }
}

export async function resolveIsRental(
    setIsRental: any,
    isReceipt: boolean,
    contractAddress: string,
    tokenId: bigint,
    account?: string,
    client?: any,
) {
    // console.log('account in resolve', account);
    if(!account) {
        setIsRental(false);
        return;
    } 
    let _contractAddr: string;
    let _tokenId: bigint;
    if(isReceipt) {
        const nftObj = await getNFTByReceipt(
          client, 
          tokenId
        );
        _contractAddr = nftObj.contractAddress;
        _tokenId = nftObj.tokenId;
    } else {
        _contractAddr = contractAddress;
        _tokenId = tokenId;
    }
    // console.log('tokenId in resolve', _tokenId);
    // console.log('contractAddress in resolve', _contractAddr);
    const isRental = await checkIsRental(
        client,
        _contractAddr, 
        _tokenId,
        account,
    );
    console.log('isRental in resolve', isRental)
    setIsRental(isRental);
}

export async function resolvePrice(
    setRentPrice: any,
    contractAddress: string,
    tokenId: bigint,
    isReceipt:boolean,
    client?: any
) {
    let _contractAddr;
    let _tokenId;
    if(isReceipt){
      const nftObj = await getNFTByReceipt(client, tokenId);
      contractAddress = nftObj.contractAddress;
      tokenId = nftObj.tokenId;
    } else{
     _contractAddr = contractAddress;
     _tokenId = tokenId;
    }
    const { price } = await getListData(
     client, 
     contractAddress,
     tokenId
    );
    if(price !== undefined) setRentPrice(formatEther(price));
}