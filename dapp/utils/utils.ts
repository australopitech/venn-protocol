import { ethers, BigNumber } from "ethers";
import erc721 from "./contractData/ERC721.artifact.json";
import { mktPlaceContract, factoryContract } from "./contractData";
import { NftItem } from '@/types/typesNftApi.d';
import walletAbi from "./contractData/RWallet.artifact.json";

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
    return (approved == mktPlaceContract.address || isOperator);
}

export const isListed = async (
    provider: any,
    nftContractAddr: string,
    tokenId: number
) => {
    const contract = new ethers.Contract(mktPlaceContract.address, mktPlaceContract.abi, provider);
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
    nftContractAddr?: string,
    tokenId?: BigNumber
) => {
    if(!provider|| !nftContractAddr || !tokenId) return;
    // console.log('contract inside ownerOf', nftContractAddr)
    // console.log('tokenId inside ownerOf', tokenId)
    const contract = new ethers.Contract(nftContractAddr, erc721.abi, provider);
    return await contract.ownerOf(tokenId);    
}

export async function isWallet(provider: any, address: string) {
    if(!provider) {
      console.log("error: no provider found");
      return
    }
    const fact = new ethers.Contract(factoryContract.address, factoryContract.abi, provider );
    const ret = await fact.isWallet(address);
    console.log('isWallet ret', ret);
    return ret
}

export async function checkIsRental(
    provider: any,
    accountAddr?: string,
    contractAddr?: string,
    tokenId?: BigNumber
) : Promise<boolean | undefined> {
    if(!accountAddr || !contractAddr || !tokenId) return
    // if(!provider) {
    //   console.log("error: no provider found");
    //   return
    // }
    const isWalletRet = await isWallet(provider, accountAddr); 
    if(isWalletRet) {
      const wallet = new ethers.Contract(accountAddr, walletAbi.abi, provider);
      const ret = await wallet.isRental(contractAddr, tokenId);
      console.log('isRental', ret);
      return ret
    } else if(isWalletRet === false){
      console.log('account is not a wallet');
      return false
    } else console.log('error: isWallet: no return value')
}
  
export async function getListData(
    provider: any,
    nftContractAddress?: string,
    tokenId?: BigNumber
  ) : Promise<{
    price: BigNumber | undefined,
    maxDur: BigNumber | undefined
}> {

    if(!nftContractAddress || !tokenId)
        return {price: undefined, maxDur: undefined};

    const contract = new ethers.Contract(mktPlaceContract.address, mktPlaceContract.abi, provider);
    // console.log('contract in getList', contract.address);
    const price = await contract.getPrice(nftContractAddress, tokenId);
    const maxDur = await contract.getMaxDuration (nftContractAddress, tokenId);
    // console.log('price/maxDur', price.toString(), maxDur.toString(), tokenId)
    return {price, maxDur};
}

export async function getEndTime(
    provider: any, 
    account?: string, 
    nftItem?: NftItem
) {
    if(!account || !nftItem) return
    const wallet = new ethers.Contract(account, walletAbi.abi, provider );
    const rentals = await wallet.getRentals();
    const index = await wallet.getTokenIndex(
        nftItem.contractAddress,
        BigNumber.from(nftItem.nftData.token_id)
    );
    if(rentals) return rentals[index].endTime;
  }
  
export async function checkIsListedByReceipt(
    provider: any,
    receiptId: BigNumber
) {
    const nftObj = await getNFTByReceipt(provider, receiptId);
    const { maxDur } = await getListData(provider, nftObj.contractAddress, nftObj.tokenId);
    if(maxDur === undefined) {
        console.log('error: getListData: no return value');
        return
    }
    // console.log('maxDur in check', maxDur.toString(), maxDur.gt(0));
    return maxDur.gt(0);
  }
  
export async function getNFTByReceipt(
    provider: any,
    receiptId: BigNumber
) {
    const mktPlace = new ethers.Contract(mktPlaceContract.address, mktPlaceContract.abi, provider);
    const nftObj = await mktPlace.getNFTbyReceipt(receiptId);
    return nftObj;
}

export async function resolveIsListed (
    setIsListed: any,
    isReceipt?: boolean,
    contractAddr?: string,
    tokenId?: BigNumber,
    provider?: any
) {
    if(isReceipt === undefined) return;
    if(isReceipt && tokenId) {
        setIsListed(
          await checkIsListedByReceipt(provider, tokenId)
        );
        return
    }  
    const { maxDur } : { maxDur: BigNumber | undefined } = await getListData(
        provider,
        contractAddr,
        tokenId
    );
    if(maxDur) setIsListed(true);
    if(maxDur?.eq(0)) setIsListed(false);
    console.log('maxDur in resolve', maxDur?.toString(), tokenId?.toString());
}

export async function resolveIsRentedOut(
    setIsRentedOut: any,
    contractAddress: string,
    tokenId: BigNumber,
    isReceipt?: boolean,
    holder?: string,
    provider?: any
) {
    if(holder === mktPlaceContract.address) 
        setIsRentedOut(false);
    if(isReceipt) {
        const mktPlace = new ethers.Contract(mktPlaceContract.address, mktPlaceContract.abi, provider);
        const nftObj = await mktPlace.getNFTbyReceipt(tokenId);
        console.log('nftObj', nftObj)
        const nftHolder = await ownerOf(provider, nftObj.contractAddress, nftObj.tokenId);
        if(nftHolder) {
            if(nftHolder === mktPlace.address) setIsRentedOut(false);
            else setIsRentedOut(true);
        };
    } else if(holder) {
        const isWalletRet = await isWallet(provider, holder);
        if(!isWalletRet) setIsRentedOut(false);
        else {
            const ret = await checkIsRental(provider, holder, contractAddress, tokenId);
            setIsRentedOut(ret);
        }
    }
}

export async function resolveIsRental(
    setIsRental: any,
    isReceipt?: boolean,
    contractAddress?: string,
    tokenId?: BigNumber,
    account?: string,
    provider?: any,
) {
    // console.log('account in resolve', account);
    if(!account) {
        setIsRental(false);
        return;
    } 
    let _contractAddr: string | undefined;
    let _tokenId: BigNumber | undefined;
    if(isReceipt && tokenId) {
        const nftObj = await getNFTByReceipt(
        provider, 
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
        provider,
        account,
        _contractAddr, 
        _tokenId
    );
    // console.log('isRental in resolve', isRental)
    setIsRental(isRental);
}

export async function resolvePrice(
    setRentPrice: any,
    contractAddress: string,
    tokenId: BigNumber,
    isReceipt?:boolean,
    provider?: any
) {
    let _contractAddr;
    let _tokenId;
    if(isReceipt && provider){
      const nftObj = await getNFTByReceipt(provider, tokenId);
      contractAddress = nftObj?.contractAddress;
      tokenId = nftObj?.tokenId;  
    } else{
     _contractAddr = contractAddress;
     _tokenId = tokenId;
    }
    const { price } = await getListData(
     provider, 
     contractAddress,
     tokenId
    );
    if(price) setRentPrice(ethers.utils.formatEther(price));
}