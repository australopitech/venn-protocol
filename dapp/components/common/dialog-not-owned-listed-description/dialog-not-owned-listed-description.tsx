import React, { useEffect, useMemo } from 'react';
import styles from './dialog-not-owned-listed-description.module.css';
import { useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { rent } from '@/utils/call';
import { useSigner, useEthers } from '@usedapp/core';
import { NftItem } from '@/types/types';
import { getListData } from '../nft-dialog/nft-dialog';
import mktPlace from '../../../utils/contractData/MarketPlace.json';
import { isWallet } from '../nft-dialog/nft-dialog';

export interface DialogNotOwnedListedDescriptionProps {
  index?: number;
  activeAccount?: string;
  nftItem?: NftItem;
  setIsNFTOpen?: any;
}

async function getFee(provider: any) : Promise<BigNumber> {
  const contract = new ethers.Contract(mktPlace.address, mktPlace.abi, provider);
  return await contract.serviceAliquot();
}


// let nft: any;
// let _title: string | undefined;
// let _name: string | undefined;

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogNotOwnedListedDescription = ({ index, activeAccount, nftItem, setIsNFTOpen }: DialogNotOwnedListedDescriptionProps) => {
  const [duration, setDuration] = useState<number | undefined>();
  const [isDurationInvalid, setIsDurationInvalid] = useState<boolean | undefined>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWalletAccount, setIsWalletAccount] = useState<boolean>();
  const defaultButtonText = "Rent It!";
  const [buttonText, setButtonText] = useState<string>(defaultButtonText);
  const signer = useSigner();
  const { account, library } = useEthers(); 
  const nft = {maxDuration: 10, price: 0.01}

  useEffect(() => {
    const resolveIsWallet = async() => {
      if(account) 
        setIsWalletAccount(
          await isWallet(library, account)
        );
    }
    resolveIsWallet();
  }, [account]);


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

    const handleButtonClick = async() => {
      if(!signer) {
        alert('Connect your wallet!')
        return
      }
      if(buttonText !== defaultButtonText) return
      if(!nftItem) {
        console.log('error: no nft found');
        return
      }
      if(!duration) {
        alert('Enter a value for duration');
        return
      }
      const { price } = await getListData(signer, nftItem);
      if(price === undefined) {
        console.log('could not get price');
        return
      }
      setButtonText('Loading...');
      const rentValue = price.mul(duration);
      const aliq = await getFee(signer);
      console.log('aliq', aliq);
      const fee = rentValue.mul(aliq).div(10000);
      await rent(
        signer,
        nftItem.contractAddress,
        BigNumber.from(nftItem.nftData.token_id), 
        BigNumber.from(duration),
        rentValue.add(fee) 
      )
      setButtonText(defaultButtonText);
      setIsNFTOpen(false);
    }

    console.log('isWalletAccount', isWalletAccount);

    return (
      <div className={styles['bodyDescriptionContainer']}>
        <div className={styles.divider}></div>
        <h2 className={styles['bodyDescription']}><span className={styles.textHilight}>Rent</span> this NFT!</h2>
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
        {isWalletAccount &&
          <button className={styles.borrowButton} onClick={handleButtonClick}>{ buttonText}</button>}
        {!isWalletAccount && <div> <h2 className={styles['bodyDescription']}>
           <span className={styles.textHilight}>Click here</span> </h2> 
           <h2 className={styles['bodyDescription']}>to create a rWallet Smart Account</h2>
           </div>
           } 
      </div>
  );
};
