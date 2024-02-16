'use client'
import React, { useEffect, useState } from 'react';
import styles from './dialog-owned-rented-description.module.css';
import { delist } from '@/utils/call';
import { NftItem } from '@/types';
import { getEndTime, getNFTByReceipt, ownerOf } from '@/utils/listing-data';
import Router from 'next/router';
import { usePublicClient, useWalletClient } from 'wagmi';
import { useTimestamp } from '@/hooks/block-data';

export interface DialogOwnedRentedDescriptionProps {
  isListed?: boolean;
  nftItem?: NftItem;
  setIsNFTOpen: any;
}

// time in secs
const dayCutOff = BigInt(82800); // 23 h;
const hourCutOff = BigInt(3540); // 59 min;
const day = BigInt(86400); // 24h
const hour = BigInt(3600);
const min = BigInt(60);

const getTimestamp = async(provider: any) => {
  if(!provider) return
  const blockNum = await provider.getBlockNumber();
  return (await provider.getBlock(blockNum))?.timestamp;
}


const WarningIcon = () => {
  return (
    // <svg width="20px" height="20px" viewBox="0 0 61.44 61.44" xmlns="http://www.w3.org/2000/svg">
    //   <path fill="#000000" d="M30.72 3.84a26.88 26.88 0 1 1 0 53.76 26.88 26.88 0 0 1 0 -53.76zm0 49.92a23.04 23.04 0 0 0 0 -46.08 23.04 23.04 0 0 0 0 46.08zm2.88 -10.56a2.88 2.88 0 1 1 -5.76 0 2.88 2.88 0 0 1 5.76 0zm-2.88 -27.84a1.92 1.92 0 0 1 1.92 1.92v17.28a1.92 1.92 0 0 1 -3.84 0V17.28a1.92 1.92 0 0 1 1.92 -1.92z"/>
    // </svg>
    <svg className={styles.warningIcon} width="18px" height="18px" viewBox="0 0 61.44 61.44" xmlns="http://www.w3.org/2000/svg">
    <path 
      fill="#D52941" 
      stroke="#D52941" 
      stroke-width="2" 
      stroke-linecap="round"
      d="M30.72 3.84a26.88 26.88 0 1 1 0 53.76 26.88 26.88 0 0 1 0 -53.76zm0 49.92a23.04 23.04 0 0 0 0 -46.08 23.04 23.04 0 0 0 0 46.08zm2.88 -10.56a2.88 2.88 0 1 1 -5.76 0 2.88 2.88 0 0 1 5.76 0zm-2.88 -27.84a1.92 1.92 0 0 1 1.92 1.92v17.28a1.92 1.92 0 0 1 -3.84 0V17.28a1.92 1.92 0 0 1 1.92 -1.92z"/>
    </svg>

  )
}

export const DialogOwnedRentedDescription = ({ 
  isListed,
  nftItem,
  setIsNFTOpen
}: DialogOwnedRentedDescriptionProps) => {
  const [timeLeft, setTimeLeft] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<bigint>();
  const { data: signer } = useWalletClient();
  const client = usePublicClient();
  const timestamp = useTimestamp();
  
  // console.log('timeLeft', timeLeft)
  console.log('timestamp', timestamp)
  
  useEffect(() => {
    if(nftItem) {
      if(nftItem.nftData.token_id) {
        setTokenId(BigInt(nftItem.nftData.token_id));
      } else console.error('no token id found');
    }
  },[nftItem]);
  
  useEffect(() => {
    const resolveTimeLeft = async() => {
      if(tokenId === undefined)
        return;
      const nftObj = await getNFTByReceipt(
        client, 
        tokenId
      );
      const nftHolder = await ownerOf(
        client,
        nftObj.contractAddress, 
        nftObj.tokenId
      );
      const endTime = await getEndTime(client, nftHolder, nftItem);
      console.log('endTime', endTime?.toString())
      // const timestamp = await getTimestamp(library);
      if(endTime && timestamp) setTimeLeft(endTime - timestamp)
    }

    resolveTimeLeft();
  }, [tokenId]);

  const handleButtonClick = async() => {
    if(!signer) {
      alert('Connect your wallet!')
      return
    }
    if(isLoading) return
    if(!nftItem) {
      console.error('error: no nft found');
      return
    }
    if(tokenId === undefined) {
      console.error('no token id found');
      return
    }
    setIsLoading(true);
    let hash;
    try {
      hash = await delist(
        client,
        signer, 
        tokenId
      );  
    } catch (error) {
      console.error(error);
      alert('tx failed');
      setIsLoading(false);
      return;
    }
    console.log('txHash', hash);
    alert('success');
    // setIsLoading(false);
    setIsNFTOpen(false);
    Router.reload();
  }


  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        <span>
          This NFT is currently rented to another user.
        </span>
        <span className={styles.timeLeftValue}> 
          Time Left: {
          timeLeft >= dayCutOff
          ? `${timeLeft/day} ${timeLeft/day <= 2 ? 'day' : 'days'}`
          : timeLeft >= hourCutOff
            ? `${timeLeft/hour} ${timeLeft/hour <= 2 ? 'hour' : 'hours'}`
            : timeLeft >= hour
              ? `${timeLeft/hour} ${timeLeft <= 120 ? 'minute' : 'minutes' }`
              : timeLeft > 0 ? 'less than a minute' : 'expired'
          } 
        </span>
      </div>
      
      <div className={styles.unlistContainer}>
        {isListed &&
          <div>
          <button className={styles.unlistButton} onClick={handleButtonClick}> {isLoading? 'loading...' : 'Unlist NFT'} </button>
          <div className={styles.warning}>
            <WarningIcon /><span className={styles.warningText}>{`If you choose to unlist your NFT, it'll be removed from the market after the current rental ends and won't be available for rent again until you relist it.`}</span>
          </div>
          </div>
        }
      </div>
    </div>
  );
};
