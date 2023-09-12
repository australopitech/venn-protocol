import React, { useEffect, useState } from 'react';
import styles from './dialog-not-owned-borrowed-description.module.css';
import { useBlockMeta, useEthers } from '@usedapp/core';
import { NftItem } from '@/types/types';
import walletabi from '../../../utils/contractData/RWallet.artifact.json';
import { BigNumber, ethers } from 'ethers';

export interface DialogNotOwnedBorrowedDescriptionProps {
  nftItem?: NftItem;
}

async function getEndTime(provider: any, account: string | undefined, nftItem: NftItem | undefined) {
  if(!account || !nftItem) return
  const wallet = new ethers.Contract(account, walletabi.abi, provider );
  const rentals = await wallet.getRentals();
  const index = await wallet.getTokenIndex(nftItem.contractAddress, BigNumber.from(nftItem.nftData.token_id));
  if(rentals) return rentals[index].endTime;
}

export const DialogNotOwnedBorrowedDescription = ({ 
  nftItem
}: DialogNotOwnedBorrowedDescriptionProps) => {
  // const provider = useProvider();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  // const [title, setTitle] = useState<string>();
  // const [name, setName] =  useState<string>();
  // const [endTime, setEndTime] = useState<number>();
  const { account, library, chainId } = useEthers();
  const { timestamp } = useBlockMeta({ chainId });   

  // useEffect(() => {
  //   const resolveTimeLeft = async() => {
  //     const endTime = await getEndTime(library, account, nftItem);
  //     if(endTime && timestamp) setTimeLeft(endTime - timestamp)
  //   }
  // }, [timestamp])
  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        <span>
        This NFT is a rental. The rent <span className={styles.textHilight}>expires in</span>
        </span>
        <span className={styles.timeLeftValue}> 
          {`${timeLeft} ${timeLeft === 1 ? 'day' : 'days'}`} 
        </span>
      </div>
    </div>
  );
};
