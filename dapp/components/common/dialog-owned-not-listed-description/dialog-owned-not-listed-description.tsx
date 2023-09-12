import React, { useEffect, useState } from 'react';
import styles from './dialog-owned-not-listed-description.module.css';
import classNames from 'classnames';
// import { useProvider } from 'wagmi';
// import ReleaseAsset from '../../wallet';
// import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';

export interface DialogOwnedNotListedDescriptionProps {
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
export const DialogOwnedNotListedDescription = ({ 
  className, 
  index, 
  activeAccount, 
  context 
}: DialogOwnedNotListedDescriptionProps) => {
  // const provider = useProvider();
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPriceInvalid, setIsPriceInvalid] = useState<boolean>(false);
  const [isDurationInvalid, setIsDurationInvalid] = useState<boolean>(false);
  
  const handlePriceChange = (e: any) => {
    let numValue = parseInt(e.target.value);

    if (e.target.value === '') {
      numValue = 0
    }
    console.log('numValue is ', numValue)
    // If value is negative or not a number, set it to 0
    if ((numValue < 0 || isNaN(numValue)) ) {
      setIsPriceInvalid(true);
      setPrice(0);
    } else {
      setIsPriceInvalid(false);
      setPrice(numValue);
    }
  }

  const handleDurationChange = (e: any) => {
    let numValue = parseInt(e.target.value);

    if (e.target.value === '') {
      numValue = 0
    }
    console.log('numValue is ', numValue)
    // If value is negative or not a number, set it to 0
    if ((numValue < 0 || isNaN(numValue)) ) {
      setIsDurationInvalid(true);
      setDuration(0);
    } else {
      setIsDurationInvalid(false);
      setDuration(numValue);
    }
  }

  const name = "Awesome NFT #1"
  const description = "This is an awesome NFT uhul."  

  return (
    <div className={styles['bodyDescriptionContainer']}>
      <div className={styles.divider}></div>
      <div className={styles['bodyDescription']}>
        <span className={styles.bodyText}>Fill out the fields below to <span className={styles.textHilight}>list your NFT</span>:</span>
        <span className={styles.priceInputLabel}>Price</span>
        <div className={styles['priceInputContainer']}>
          <input 
            className={styles['priceInput']}
            placeholder="0"
            type="number"
            min="0"
            // value={price}
            onChange={(e) => handlePriceChange(e)}
          />
          <div>
              <span className={styles.eth}>ETH/Day</span>
          </div>
        </div>
        {isPriceInvalid && <span className={styles.invalidValue}>Set a valid price. Value cannot be negative!</span>}

        <span className={styles.priceInputLabel}>Maximum loan duration</span>
        <div className={styles['priceInputContainer']}>
          <input 
            className={styles['priceInput']}
            placeholder="0"
            type="number"
            min="0"
            // value={duration}
            onChange={(e) => handleDurationChange(e)}
          />
          <div>
              <span className={styles.eth}>{duration === 1 ? 'Day' : 'Days'}</span>
          </div>
        </div>
        {isDurationInvalid && <span className={styles.invalidValue}>Set a valid duration. Value cannot be negative!</span>}
      </div>

      <br />

      <button className={styles.listButton}>List NFT!</button>

    </div>
  );
};
