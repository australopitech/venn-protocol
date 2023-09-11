import React, { useEffect, useState } from 'react';
import styles from './dialog-borrowed-description.module.css';
import classNames from 'classnames';
// import { useProvider } from 'wagmi';
// import ReleaseAsset from '../../wallet';
// import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';

export interface DialogBorrowedDescriptionProps {
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
export const DialogBorrowedDescription = ({ className, index, activeAccount, context }: DialogBorrowedDescriptionProps) => {
  // const provider = useProvider();
  const [timeLeft, setTimeLeft] = useState<number>();
  // const [title, setTitle] = useState<string>();
  // const [name, setName] =  useState<string>();
  const [endTime, setEndTime] = useState<number>();
  
  // nft = getNFTobj(context, activeAccount, index);
  // const title = useNFTtitle(nft? nft.contract_ : "" , nft? nft.id : 0);
  // const name = useNFTname(nft? nft.contract_ : "" , nft? nft.id : 0);
  
  // useEffect(() => {
  //   setTitle(_title);
  //   setName(_name);
  //   setEndTime(nft?.endTime);
  // }, [_name, _title, nft]);

  // useEffect(() => {
  //   if(!nft) return
  //   provider.getBlock('latest').then((b) => setTimeLeft(nft.endTime - b.timestamp));
  // }, [nft]);
  
  // const timeLeft = 2;

    const title = "blabalbal"
    const name = "osghdlvkjdmnklcvm"

    return (
      <div className={styles['description-container']}>
        <h1 className={styles.title}>{title}</h1>
        <h1 className={styles.description}>{name}</h1>
        <div className={styles['body-description-container']}>
          <div className={styles.divider}></div>
          <h2 className={styles['body-description']}>
            This NFT is loaned to you. Loan expires in 
            {timeLeft && (timeLeft > 86400? timeLeft/86400 : timeLeft>3600? timeLeft/3600 : timeLeft/60)}
            {timeLeft && (timeLeft > 86400? "Days" : timeLeft>3600? "hours" : "minutes")}          
          </h2>
        </div>
        {/* <ReleaseAsset index={index} /> */}
      </div>
    );
};
