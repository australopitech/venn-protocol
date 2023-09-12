import React, { useEffect } from 'react';
import styles from './dialog-not-owned-listed-description.module.css';
import { useState } from 'react';
import classNames from 'classnames';


export interface DialogNotOwnedListedDescriptionProps {
  someProp?: any;
}

// let nft: any;
// let _title: string | undefined;
// let _name: string | undefined;

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogNotOwnedListedDescription = ({ 
  someProp 
}: DialogNotOwnedListedDescriptionProps) => {
  const [duration, setDuration] = useState<number | undefined>();
  const [isDurationInvalid, setIsDurationInvalid] = useState<boolean | undefined>(false);
  
  const nft = {maxDuration: 10, price: 0.01}

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
    } else if (numValue > nft.maxDuration) {
      setIsDurationInvalid(true);
      setDuration(0);
    } else {
      setIsDurationInvalid(false);
      setDuration(numValue);
    }
  }

  return (
      <div className={styles['bodyDescriptionContainer']}>
        <div className={styles.divider}></div>
        <h2 className={styles.bodyDescription}><span className={styles.textHilight}>Borrow</span> this NFT!</h2>
        <h3 className={styles['priceDescription']}>
            Price: <span className={styles['priceCurrency']}>{nft ? nft.price.toString() : ""} ETH/day</span>
        </h3>
        <div className={styles.priceDescription}>{`Maximum loan period: ${nft?.maxDuration?.toString()} ${nft?.maxDuration === 1 ? 'day' : 'days'}`}</div>
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
        <button className={styles.borrowButton}> Borrow </button>
      </div>
  );
};
