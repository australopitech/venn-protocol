import React, { useEffect, useState } from 'react';
import styles from './dialog-not-owned-borrowed-description.module.css';
import { useBlockMeta, useEthers } from '@usedapp/core';
import { NftItem } from '@/types/types';
import walletabi from '../../../utils/contractData/RWallet.artifact.json';
import { BigNumber, ethers } from 'ethers';
import { useTimestamp } from '@/hooks/block-data';

export interface DialogNotOwnedBorrowedDescriptionProps {
  address?: string;
  nftItem?: NftItem;
}

const dayCutOff = 82800; // 23 h;
const hourCutOff = 3540 // 59 min;

async function getEndTime(provider: any, account: string | undefined, nftItem: NftItem | undefined) {
  if(!account || !nftItem) return
  const wallet = new ethers.Contract(account, walletabi.abi, provider );
  const rentals = await wallet.getRentals();
  const index = await wallet.getTokenIndex(nftItem.contractAddress, BigNumber.from(nftItem.nftData.token_id));
  if(rentals) return rentals[index].endTime;
}

export const DialogNotOwnedBorrowedDescription = ({ 
  address,
  nftItem
}: DialogNotOwnedBorrowedDescriptionProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { account, library, chainId } = useEthers();
  const timestamp = useTimestamp({ chainId: chainId, isStatic: false, refresh: 10});
  
  console.log('timestamp', timestamp, typeof timestamp);

  useEffect(() => {
    const resolveTimeLeft = async() => {
      const endTime = await getEndTime(library, address ?? account, nftItem);
      if(endTime && timestamp) setTimeLeft(endTime - timestamp)
    }

    resolveTimeLeft();
  }, [timestamp]);

  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        {timeLeft > 0 &&
          <>
          <span>
          This NFT is a rental. The rent <span className={styles.textHilight}>expires in</span>
          </span>
          <span className={styles.timeLeftValue}> 
            {timeLeft >= dayCutOff
              ? `${timeLeft/86400} ${timeLeft/86400 <= 2 ? 'day' : 'days'}`
              : timeLeft >= hourCutOff
                ? `${timeLeft/3600} ${timeLeft/3600 <= 2 ? 'hour' : 'hours'}`
                : timeLeft >= 60
                  ? `${timeLeft/60} ${timeLeft <= 120 ? 'minute' : 'minutes' }`
                  : 'less than a minute'
            } 
          </span></>
        }
        {timeLeft <= 0 &&
          <>
          <span>
          This NFT is a rental. The rent <span className={styles.textHilight}>is expired.</span>
          </span>
          </>
        }
        {/** holder === signer.address &&
         *  <`Release NFT` button /> */}
      </div>
    </div>
  );
};
