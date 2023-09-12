import React, { useEffect, useState } from 'react';
import styles from './dialog-not-owned-borrowed-description.module.css';
import classNames from 'classnames';
// import { useProvider } from 'wagmi';
// import ReleaseAsset from '../../wallet';
// import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';

export interface DialogNotOwnedBorrowedDescriptionProps {
    className?: string;
    index?: number;
    activeAccount?: string;
    context?: string;
}

let nft: any;
let _title: string | undefined;
let _name: string | undefined;


/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogNotOwnedBorrowedDescription = ({ 
  className, 
  index, 
  activeAccount, 
  context 
}: DialogNotOwnedBorrowedDescriptionProps) => {
  // const provider = useProvider();
  // const [timeLeft, setTimeLeft] = useState<number>();
  // const [title, setTitle] = useState<string>();
  // const [name, setName] =  useState<string>();
  // const [endTime, setEndTime] = useState<number>();

  const name = "Awesome NFT #1"
  const description = "This is an awesome NFT uhul."
  const timeLeft = 3
  

  return (
    <div className={styles['descriptionContainer']}>
      <h1 className={styles.title}>{name}</h1>
      <h2 className={styles.bodyDescription}>{description}</h2>
      <div className={styles['bodyDescriptionContainer']}>
        <div className={styles.divider}></div>
        <div className={styles['bodyDescription']}>
          {`This NFT was lent to you. The loan expires in ${timeLeft} days.`}
          {/* ${timeLeft && parseFloat((timeLeft > 86400? timeLeft/86400 : timeLeft>3600? timeLeft/3600 : timeLeft/60).toFixed(2))}
          ${timeLeft && (timeLeft > 86400? "days" : timeLeft>3600? "hours" : "minutes")}.`}           */}
        </div>
      </div>
      {/* <ReleaseAsset index={index} /> */}
    </div>
  );
};
