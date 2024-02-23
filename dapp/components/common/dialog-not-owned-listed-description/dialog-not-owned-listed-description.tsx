'use client'
import React, { useEffect } from 'react';
import styles from './dialog-not-owned-listed-description.module.css';
import { useState } from 'react';
import { mktPlaceContract, receiptsContract } from '@/utils/contractData';
import { isSmartAccount, getListData, getNFTByReceipt } from '../../../utils/listing-data';
import { rentCallData } from '@/utils/call';
import { PublicClient, useAccount, useNetwork, usePublicClient, useWalletClient } from 'wagmi';
import { getAddress, formatEther } from 'viem';
import { useSmartAccount } from '@/app/account/venn-provider';
import { ApproveData, NftObj, NftItem } from '@/types';
import { useListingData, useRealNft } from '@/hooks/nft-data';

export interface DialogNotOwnedListedDescriptionProps {
  setIsNFTOpen: any;
  setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>;
  setError: any,
  txLoading: boolean,
  index?: number;
  activeAccount?: string;
  contractAddress?: string;
  tokenId?: bigint;
  isReceipt?: boolean;
}

const mktPlaceAddr = mktPlaceContract.address as `0x${string}`;


async function getFee(client: PublicClient) : Promise<any> {
  return await client.readContract({
    address: mktPlaceAddr,
    abi: mktPlaceContract.abi,
    functionName: 'serviceAliquot',
  });
}


// let nft: any;
// let _title: string | undefined;
// let _name: string | undefined;

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogNotOwnedListedDescription = ({ 
  txLoading, contractAddress, tokenId, isReceipt, setApproveData, setError 
}: DialogNotOwnedListedDescriptionProps) => {
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [duration, setDuration] = useState<number | undefined>();
  const [isDurationInvalid, setIsDurationInvalid] = useState<boolean | undefined>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isSmartaccount, setIsSmartaccount] = useState<boolean>();
  const defaultButtonText = "Rent It!";
  const [buttonText, setButtonText] = useState<string>(defaultButtonText);
  // const [rentPrice, setRentPrice] = useState<bigint>();
  // const [maxDuration, setMaxDuration] = useState<bigint>();
  // 
  const nft = useRealNft({
    contract: contractAddress as `0x${string}`,
    tokenId
  })
  const listingData = useListingData({
    contract: contractAddress as `0x${string}`,
    tokenId
  });
  const { data: signer } = useWalletClient();
  const { address: account } = useAccount();
  const client = usePublicClient();
  const { provider, address: vsaAddr } = useSmartAccount();
  const { chain } = useNetwork();

  // useEffect(() => {
  //   const resolveIsSmartAccount = async() => {
  //     if(account)
  //       setIsSmartaccount(
  //         await isSmartAccount(client, vsaAddr?? account)
  //       );
  //   }
  //   resolveIsSmartAccount();
  // }, [account]);

  useEffect(() => {
    console.log('render')
    if(!nft.isLoading && !nft.isLoading)
      setTimeout(() => {
        setLoadingInfo(false);
      }, 2000);
  }, [nft, listingData])
  
  useEffect(() => {
    if(txLoading)
      setButtonText('Loading...')
    else 
      setButtonText(defaultButtonText)
  }, [txLoading]);

  // useEffect(() => {
  //   const resolveListData = async() => {
  //     if(!nftItem) return
  //     if(!nftItem.nftData.token_id) {
  //       console.error('no token id found');
  //       return
  //     }
  //     let contractAddr: string;
  //     let tokenId: bigint;
  //     if(getAddress(nftItem.contractAddress) === receiptsContract.address) { /**isReceipt */
  //       const nftObj = await getNFTByReceipt(client, BigInt(nftItem.nftData.token_id));
  //       contractAddr = nftObj.contractAddress;
  //       tokenId = nftObj.tokenId;
  //     } else {
  //       contractAddr = nftItem.contractAddress;
  //       tokenId = BigInt(nftItem.nftData.token_id);
  //     }
  //     if(!contractAddr || tokenId === undefined) return
  //     const { price, maxDur } = await getListData(client, contractAddr, tokenId);
  //     setRentPrice(price);
  //     setMaxDuration(maxDur);
  //   }

  //   resolveListData();
    
  // }, [client])


  const handleChange = (e: any) => {
    let numValue = parseInt(e.target.value);

    if (e.target.value === '') {
      numValue = 0
    }
    console.log('numValue is ', numValue)
    // If value is negative or not a number, set it to 0
    if (numValue < 0 || isNaN(numValue)) {
      setIsDurationInvalid(true);
      setDuration(0);
    } else if ( listingData.data?.maxDur! < BigInt(numValue) ) {
      setIsDurationInvalid(true);
      setDuration(0);
    } else {
      setIsDurationInvalid(false);
      setDuration(numValue);
    }
  }

    const handleButtonClick = async() => {
      if(!signer) {
        alert('Connect your wallet!')
        return
      }
      if(buttonText !== defaultButtonText) return
      if(!provider) {
        alert("Connect with a Venn smart account to enable rent tx's");
        return
      } 
      if(!nft.data?.contract || !nft.data.tokenId) {
        console.error('missing nft info');
        return
      }
      if(!duration) {
        alert('Enter a value for duration');
        return
      }
      const aliq = await getFee(client);
      if(listingData.data === undefined || aliq === undefined) {
        const err = 'error: could not get price or service-aliquot'
        console.log(err);
        setError(err);
        return
      }
      // setButtonText('Loading...');
      const rentValue = listingData.data.price * BigInt(duration);
      // console.log('aliq', aliq, typeof aliq);
      // console.log('rentValue', rentValue)
      const fee = (rentValue * BigInt(aliq)) / 10000n;
      setApproveData({
        type: 'Internal',
        data: {
          targetAddress: mktPlaceContract.address as `0x${string}`,
          value: rentValue + fee,
          calldata: rentCallData(
            nft.data.contract,
            nft.data.tokenId,
            duration
          )
        }
      });
    }

    if(loadingInfo)
      return (
        <div className={styles['bodyDescriptionContainer']}>
          <div className={styles.divider}></div>
          <div className={styles.bodyDescription}>
            Please Wait.<br/>Loading NFT info...  
          </div>
        </div>
      )
    return (
      <div className={styles['bodyDescriptionContainer']}>
        <div className={styles.divider}></div>
        <h2 className={styles['bodyDescription']}><span className={styles.textHilight}>Rent</span> this NFT!</h2>
        <h3 className={styles['priceDescription']}>
            Price: <span className={styles['priceCurrency']}>{listingData.data?.price ? formatEther(listingData.data.price) : ""} {chain?.nativeCurrency.symbol}/day</span>
        </h3>
        <div className={styles.priceDescription}>{`Maximum loan period: ${listingData.data?.maxDur.toString()} ${listingData.data?.maxDur === 1n  ? 'day' : 'days'}`}</div>
        <div className={styles.priceWrapper}>
            <div className={styles.priceInputContainer}>
                <input 
                  className={styles.priceInput}
                  placeholder="0"
                  type="number"
                  min="0"
                  // value={duration}
                  onChange={(e) => handleChange(e)}
                />
                <div>
                    <span className={styles.eth}>Days</span>
                </div>
            </div>
            {isDurationInvalid && <span className={styles.invalidDuration}>{`Set a valid duration. Value cannot be negative and must respect the maximum loan period.`}</span>}
        </div>
        {vsaAddr &&
          <button className={styles.borrowButton} onClick={handleButtonClick}>{ buttonText}</button>}
        {!vsaAddr && 
          <div className={styles.notConnectedMessage}> 
            <button className={styles.notConnectedButton} onClick={handleButtonClick}>{ buttonText}</button>
            <p>
              <span className={styles.textLink}>Click here</span> to create a rWallet Smart Account!
            </p>
          </div>
        } 
      </div>
  );
};
