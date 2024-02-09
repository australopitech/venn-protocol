import erc721 from "./contractData/ERC721.artifact.json";
import { mktPlaceContract, factoryContract } from "./contractData";
import { NftItem } from '@/types/typesNftApi.d';
import walletAbi from "./contractData/SmartAccount.json";
import { readContract } from "viem/actions";
import { PublicClient, createPublicClient } from "viem";
import { formatEther } from "viem";
import { getAddress } from "viem";

interface NftObj {
    contractAddress: `0x${string}`,
    tokenId: bigint
}

const erc721abi = erc721.abi as any;
const mktPlaceAddr = mktPlaceContract.address as `0x${string}`;
const mktPlaceAbi = mktPlaceContract.abi as any;


export const isApproved = async (
    client: PublicClient,
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
        }) as unknown as string;
        // approved = await contract.getApproved(tokenId);
        isOperator = await client.readContract({
            address: contractAddr,
            abi: erc721abi,
            functionName: 'isApprovedForAll',
            args: [tokenOwner, to]
        }) as unknown as boolean;
        // isOperator = await contract.isApprovedForAll(tokenOwner, to)
    } catch (err) {
        console.error(err);
    }
    if(!approved && isOperator === undefined ) return undefined;
    // console.log('approved', approved, 'isOperator', isOperator);
    return (approved == mktPlaceAddr || isOperator);
}

export const isListed = async (
    client: PublicClient,
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
        }) as unknown as bigint;
        // console.log('maxDuration', maxDuration);
    } catch (error) {
        console.log(error)
    }
    if(maxDuration) return (maxDuration > 0);
}

export const ownerOf = async (
    client: PublicClient,
    nftContractAddr: string,
    tokenId: bigint
) => {
    console.log(
        'nftContractAddr', nftContractAddr,
        'tokenId', tokenId
    )
    const owner =  await client.readContract({
        address: nftContractAddr as `0x${string}`,
        abi: erc721.abi,
        functionName: 'ownerOf',
        args: [tokenId]
    }) as unknown as `0x${string}`;''
    console.log('ownerOf return', owner);
    return owner
}

export async function isSmartAccount(client: any, address: string) {
    const ret = await client.readContract({
        address: factoryContract.address as `0x${string}`,
        abi: factoryContract.abi,
        functionName: 'isSmartAccount',
        args: [address]
    }) as boolean;
    // console.log('isSmartAccount ret', ret);
    return ret
}

export async function isRental(
    contractAddr: string,
    tokenId: bigint,
    accountAddr?: string,
    client?: any,
) : Promise<boolean | undefined> {
    const acc = accountAddr ?? await ownerOf(client, contractAddr, tokenId);
    const isSmartAccountRet = await isSmartAccount(client, acc); 
    if(isSmartAccountRet) {
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
    } else if(isSmartAccountRet === false){
      console.log('account is not a wallet');
      return false
    } else console.log('error: isSmartAccount: no return value')
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
    return client.readContract({
        address: mktPlaceAddr,
        abi: mktPlaceAbi,
        functionName: 'getNFTbyReceipt',
        args: [receiptId]
    }) as unknown as NftObj ;
}

export async function checkIsListed (
    isReceipt: boolean,
    contractAddr: string,
    tokenId: bigint,
    client?: any
) {
    if(isReceipt)
        return await checkIsListedByReceipt(client, tokenId);

    const { maxDur } : { maxDur: bigint | undefined } = await getListData(
        client,
        contractAddr,
        tokenId
    );
    if(maxDur !== undefined) 
      return maxDur > 0;
    // console.log('maxDur in resolve', maxDur?.toString(), tokenId?.toString());
}

export async function checkIsRentedOut(
    contractAddress: string,
    tokenId: bigint,
    isReceipt?: boolean,
    holder?: string,
    client?: any
) : Promise<boolean | undefined> {
    if(holder === mktPlaceAddr) 
        return false
    // if(!client)
    //     return
    if(isReceipt) {
        const nftObj = await getNFTByReceipt(client, tokenId);
        // console.log('nftObj', nftObj)
        const nftHolder = await ownerOf(client, nftObj.contractAddress, nftObj.tokenId);
        // console.log('nftHolder', nftHolder)
        if(nftHolder) {
            if(nftHolder === mktPlaceAddr) return false;
            else return true;
        };
    } else if(holder) {
        const isSmartAccountRet = await isSmartAccount(client, holder);
        console.log('isSmartAccount', isSmartAccountRet)
        if(isSmartAccountRet === false) return false;
        else {
            const ret = await isRental(contractAddress, tokenId, holder, client);
            return ret;
        }
    }
}

export async function checkIsRental(
    isReceipt: boolean,
    contractAddress: string,
    tokenId: bigint,
    account?: string,
    client?: any,
) {
    // console.log('account in resolve', account);
    if(!account) 
        return false;

    if(!client)
        return

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
    return await isRental(
        _contractAddr, 
        _tokenId,
        account,
        client
    );
}

export async function checkPrice(
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
    return price;
}

