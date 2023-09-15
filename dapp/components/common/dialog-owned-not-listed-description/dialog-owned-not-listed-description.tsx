import React, { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import styles from './dialog-owned-not-listed-description.module.css';
import classNames from 'classnames';
// import { useProvider } from 'wagmi';
// import ReleaseAsset from '../../wallet';
// import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';
import { NftItem } from '@/types/types';
import { list, approve } from '@/utils/call';
import { useSigner, useEthers } from '@usedapp/core';
import mktPlace from '../../../utils/contractData/MarketPlace.json';
import erc721 from '../../../utils/contractData/ERC721.artifact.json';

export interface DialogOwnedNotListedDescriptionProps {
    className?: string;
    index?: number;
    activeAccount?: string;
    context?: string;
    nftItem?: NftItem
}

let nft: any;
let _title: string | undefined;
let _name: string | undefined;

const useIsApproved = (nftItem: NftItem | undefined) => {
  const {account, library} = useEthers();
  const [isAppr, setIsAppr] = useState<boolean>();
  useEffect(() => {
    const resolveIsApproved = async() => {
      if(!nftItem) return
      const contract = new ethers.Contract(nftItem.contractAddress, erc721.abi, library);
      const approved = await contract.getApproved(BigNumber.from(nftItem.nftData.token_id));
      const isOperator = await contract.isApprovedForAll(account, mktPlace.address);
      setIsAppr( approved === mktPlace.address || isOperator);
    }
    resolveIsApproved();

  }, [account]);

  return isAppr
}

/** TODO:
 * - make component re-render on approval call completion
 * - show generic "listing successful" screen on list call completion
 * - after call nft data must be refetched in parent component nft-dialog
 */

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogOwnedNotListedDescription = ({ 
  className, 
  index, 
  activeAccount, 
  context,
  nftItem
}: DialogOwnedNotListedDescriptionProps) => {
  // const provider = useProvider();
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPriceInvalid, setIsPriceInvalid] = useState<boolean>(false);
  const [isDurationInvalid, setIsDurationInvalid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const signer = useSigner();

  const isApproved = useIsApproved(nftItem);
  console.log('isApproved', isApproved)

  console.log('signer', signer)
  
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

  const handleButtonClick = async() => {
    if(!signer) {
      alert('Connect your wallet!')
      return
    }
    if(isLoading) return
    if(!nftItem) {
      console.log('error: no nft found');
      return
    }
    if(isPriceInvalid || isDurationInvalid) {
      alert('Set valid values for price and max duration!');
      return
    }
    setIsLoading(true);
    if(!isApproved) {
      await approve(
        signer,
        nftItem.contractAddress,
        BigNumber.from(nftItem.nftData.token_id),
        mktPlace.address
      );
      return
    }

    const priceInWei = ethers.utils.parseEther(price.toString());
    // const durationInSec = BigNumber.from(duration*24*60*60);
    await list(
      signer,
      nftItem.contractAddress,
      BigNumber.from(nftItem.nftData.token_id),
      priceInWei,
      BigNumber.from(duration)
    );
    setIsLoading(false);
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
        {isDurationInvalid && <span className={styles.invalidValue}>Set a valid duration. Must be greater than zero!</span>}
      </div>
      <br />
      <button className={styles.listButton} onClick={handleButtonClick}>{isApproved? 'List NFT!' : 'Approve Listing'}</button>
    </div>
  );
};
