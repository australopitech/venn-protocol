import React, { useEffect, useMemo, useState } from 'react';
import styles from './dialog-owned-rented-description.module.css';
import { useSigner, useEthers } from '@usedapp/core';
import { delist } from '@/utils/call';
import { NftItem } from '@/types/typesNftApi.d';
import { BigNumber } from 'ethers';
import { getEndTime, getNFTByReceipt, ownerOf } from '@/utils/utils';
import { useTimestamp } from '@/hooks/block-data';
import Router from 'next/router';

export interface DialogOwnedRentedDescriptionProps {
  isListed?: boolean;
  nftItem?: NftItem;
  setIsNFTOpen: any;
}

const dayCutOff = 82800; // 23 h;
const hourCutOff = 3540 // 59 min;

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
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const signer = useSigner();
  const { account, library, chainId } = useEthers();

  const timestamp = useTimestamp({ chainId: chainId, isStatic: false, refresh: 5});
  
  console.log('timeLeft', timeLeft)
  
  useEffect(() => {
    const resolveTimeLeft = async() => {
      const nftObj = await getNFTByReceipt(
        library, 
        BigNumber.from(nftItem?.nftData.token_id)
      );
      const nftHolder = await ownerOf(
        library, 
        nftObj.contractAddress, 
        nftObj.tokenId
      );
      const endTime = await getEndTime(library, nftHolder, nftItem);
      console.log('endTime', endTime?.toNumber())
      // const timestamp = await getTimestamp(library);
      if(endTime && timestamp) setTimeLeft(endTime.toNumber() - timestamp)
    }

    resolveTimeLeft();
  }, []);

  const handleButtonClick = async() => {
    if(!signer) {
      alert('Connect your wallet!')
      return
    }
    if(isLoading) return
    if(!nftItem) {
      console.log('error: no nft found');
      return
    }
    setIsLoading(true);
    let txReceipt;
    try {
      txReceipt = await delist(
        signer, 
        BigNumber.from(nftItem.nftData.token_id)
      );  
    } catch (error) {
      console.log(error);
      alert('tx failed');
      setIsLoading(false);
      return;
    }
    console.log('txHash', txReceipt.transactionHash);
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
          ? `${timeLeft/86400} ${timeLeft/86400 <= 2 ? 'day' : 'days'}`
          : timeLeft >= hourCutOff
            ? `${timeLeft/3600} ${timeLeft/3600 <= 2 ? 'hour' : 'hours'}`
            : timeLeft >= 60
              ? `${timeLeft/60} ${timeLeft <= 120 ? 'minute' : 'minutes' }`
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
