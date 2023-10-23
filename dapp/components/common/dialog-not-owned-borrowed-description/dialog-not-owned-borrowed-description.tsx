import React, { useEffect, useState } from 'react';
import styles from './dialog-not-owned-borrowed-description.module.css';
import { useBlockMeta, useEthers } from '@usedapp/core';
import { NftItem } from '@/types/typesNftApi.d';
import walletabi from '../../../utils/contractData/RWallet.artifact.json';
import { receiptsContract } from '@/utils/contractData';
import { BigNumber, ethers } from 'ethers';
import { useTimestamp } from '@/hooks/block-data';
import { getNFTByReceipt, ownerOf } from '@/utils/utils';

export interface DialogNotOwnedBorrowedDescriptionProps {
  address?: string;
  nftItem?: NftItem;
  isRental?: boolean;
}

const dayCutOff = 82800; // 23 h;
const hourCutOff = 3540 // 59 min;

async function getEndTime(
  provider: any, 
  account?: string, 
  nftItem?: NftItem,
  ) {
  if(!account || !nftItem) return
  let contractAddr: string;
  let tokenId: BigNumber;
  let acc: string;
  if(ethers.utils.getAddress(nftItem.contractAddress) === receiptsContract.address) {
    const nftObj = await getNFTByReceipt(
      provider,
      BigNumber.from(nftItem.nftData.token_id)
    );
    contractAddr = nftObj.contractAddress;
    tokenId = nftObj.tokenId;
    acc = await ownerOf(provider, contractAddr, tokenId);
  } else {
    contractAddr = nftItem.contractAddress;
    tokenId = BigNumber.from(nftItem.nftData.token_id)
    acc = account;
  }
  const wallet = new ethers.Contract(acc, walletabi.abi, provider );
  const rentals = await wallet.getRentals();
  const index = await wallet.getTokenIndex(contractAddr, tokenId);
  console.log('tokenIndex', index);
  console.log('rental', rentals[index]);
  if(rentals) return rentals[index].endTime;
}

export const DialogNotOwnedBorrowedDescription = ({ 
  address,
  nftItem,
  isRental
}: DialogNotOwnedBorrowedDescriptionProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { account, library, chainId } = useEthers();
  const timestamp = useTimestamp({ chainId: chainId, isStatic: false, refresh: 5});
  
  console.log('timestamp', timestamp, typeof timestamp);
  

  useEffect(() => {
    const resolveTimeLeft = async() => {
      const addr = address ?? account;
      console.log('addr', addr)
      const endTime = await getEndTime(library, addr, nftItem);
      console.log('endTime', endTime?.toString());
      if(endTime && timestamp) setTimeLeft(endTime.sub(timestamp).toNumber())
    }

    resolveTimeLeft();
    console.log('timeLeft', timeLeft)
  }, [timestamp, library]);

  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        {timeLeft > 0 &&
          <>
          <span>
          This NFT is {isRental? "rented by you" : "rented"}. The rent <span className={styles.textHilight}>expires in</span>
          </span>
          <span className={styles.timeLeftValue}> 
            {timeLeft >= dayCutOff
              ? `${parseFloat(String(timeLeft/86400)).toFixed(1)} ${timeLeft/86400 <= 2 ? 'day' : 'days'}`
              : timeLeft >= hourCutOff
                ? `${parseFloat(String(timeLeft/3600)).toFixed(1)} ${timeLeft/3600 <= 2 ? 'hour' : 'hours'}`
                : timeLeft >= 60
                  ? `${parseFloat(String(timeLeft/60)).toFixed(1)} ${timeLeft <= 120 ? 'minute' : 'minutes' }`
                  : 'less than a minute'
            } 
          </span></>
        }
        {timeLeft <= 0 &&
          <>
          <span>
          This NFT is {isRental? 'rented by you' : 'rented'}.<br></br> The rent <span className={styles.textHilight}>is expired.</span>
          </span>
          </>
        }
        {/** holder === signer.address &&
         *  <`Release NFT` button /> */}
      </div>
    </div>
  );
};
