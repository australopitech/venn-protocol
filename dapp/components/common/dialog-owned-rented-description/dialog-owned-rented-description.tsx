import React, { useEffect, useState } from 'react';
import styles from './dialog-owned-rented-description.module.css';
// import { useProvider } from 'wagmi';
// import ReleaseAsset from '../../wallet';
// import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';

export interface DialogOwnedRentedDescriptionProps {
  someProp?: any;
  // className?: string;
  // index?: number;
  // activeAccount?: string;
  // context?: string;
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


/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogOwnedRentedDescription = ({ 
  someProp
}: DialogOwnedRentedDescriptionProps) => {
  // const provider = useProvider();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  // const [title, setTitle] = useState<string>();
  // const [name, setName] =  useState<string>();
  // const [endTime, setEndTime] = useState<number>();

  const name = "Awesome NFT #1"
  const description = "This is an awesome NFT uhul This is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhul."
  // const timeLeft = 3
  

  return (
    <div className={styles['descriptionContainer']}>
      {/* <div className={styles.nftInfoContainer}> */}
      <h1 className={styles.title} title={name}>{name}</h1>
      <p className={styles.nftDescription}>
        {description}
      </p>
      {/* </div> */}
      <div className={styles['bodyDescriptionContainer']}>
        <div className={styles.divider}></div>
        <div className={styles['bodyDescription']}>
          {`This NFT is currently rented to another user and will return to your wallet in `} 
          <span className={styles.timeLeftValue}> {`${timeLeft} ${timeLeft === 1 ? 'day' : 'days'}`} </span>
          {`.`}

          <br />
          <br />

          <div className={styles.unlistContainer}>
            <button className={styles.rentButton}> Unlist NFT</button>
            <div className={styles.warning}>
              <WarningIcon /><span className={styles.warningText}>{`If you choose to unlist, it'll be removed from the market after the current rental ends and won't be available for rent again until you relist it.`}</span>
            </div>
          </div>

        </div>
      </div>
      {/* <ReleaseAsset index={index} /> */}
    </div>
  );
};
