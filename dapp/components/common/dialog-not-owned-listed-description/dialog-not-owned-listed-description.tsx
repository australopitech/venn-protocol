import React, { useEffect } from 'react';
import styles from './dialog-not-owned-listed-description.module.css';
import { useState } from 'react';
import { ethers } from 'ethers';


export interface DialogNotOwnedListedDescriptionProps {
  index?: number;
  activeAccount?: string;
}

// let nft: any;
// let _title: string | undefined;
// let _name: string | undefined;

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogNotOwnedListedDescription = ({ index, activeAccount }: DialogNotOwnedListedDescriptionProps) => {
    const [duration, setDuration] = useState<number | undefined>();
    const [isDurationInvalid, setIsDurationInvalid] = useState<boolean | undefined>(false);
    
    const handleChange = (e: any) => {
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
    const nft = {maxDuration: 30, price: 0.01}

    return (
        <div className={styles['descriptionContainer']}>
            <h1 className={styles.title}>{name}</h1>
            <h2 className={styles.bodyDescription}>{description}</h2>
            <div className={styles['bodyDescriptionContainer']}>
                <div className={styles.divider}></div>
                <h2 className={styles['bodyDescription']}>Borrow this NFT!</h2>
                <h3 className={styles['priceDescription']}>
                    Price: <span className={styles['priceCurrency']}>{nft ? nft.price.toString() : ""} wei/day</span>
                </h3>
                <div className={styles.priceDescription}>{`Max Loan Period: ${nft ? nft.maxDuration.toString() : ""} days`}</div>
                <div>
                    <div className={styles['priceInputContainer']}>
                        <input 
                          className={styles['priceInput']}
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
                    {isDurationInvalid && <span className={styles.invalidDuration}>Set a valid duration. Value cannot be negative!</span>}
                </div>
                <button> Borrow </button>
                {/* <Borrow
                  lender={nft? nft.lender : ethers.constants.AddressZero}
                  index={index}
                  duration={duration}
                  price={nft? nft.price : 0}
                /> */}
            </div>
        </div>
    );
};
