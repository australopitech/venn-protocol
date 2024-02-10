'use client'
import React, { useEffect, useRef, useState } from 'react';
// import { ethers, BigNumber } from 'ethers';
import styles from './dialog-owned-not-listed-description.module.css';
import classNames from 'classnames';
// import { useProvider } from 'wagmi';
// import ReleaseAsset from '../../wallet';
// import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';
import { NftItem } from '@/types/typesNftApi.d';
import { list, approve } from '@/utils/call';
// import { useSigner, useEthers } from '@usedapp/core';
import { mktPlaceContract } from '@/utils/contractData';
import erc721 from '../../../utils/contractData/ERC721.artifact.json';
import { useRouter } from 'next/navigation';
import { isApproved as getIsApproved } from '@/utils/listing-data';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseEther } from 'viem';
import { baseGoerli } from 'viem/chains';
// import { client } from '@/pages/client';

export interface DialogOwnedNotListedDescriptionProps {
    className?: string;
    index?: number;
    activeAccount?: string;
    context?: string;
    nftItem?: NftItem
    setIsNFTOpen: any
}

let nft: any;
let _title: string | undefined;
let _name: string | undefined;

// const resolveIsApproved = async(
//   provider: any,
//   setIsAppr: any,
//   nftItem?: NftItem, 
//   account?: string
// ) => {
//   if(!nftItem || !account)
//     return
//   const contract = new ethers.Contract(nftItem.contractAddress, erc721.abi, provider);
//   const approved = await contract.getApproved(BigNumber.from(nftItem.nftData.token_id));
//   const isOperator = await contract.isApprovedForAll(account, mktPlaceContract.address);
//   setIsAppr( approved === mktPlaceContract.address || isOperator);
// }

/** TODO:
 * - make component re-render on approval call completion
 * - show generic "listing successful" screen on listing call completion
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
  nftItem,
  setIsNFTOpen
}: DialogOwnedNotListedDescriptionProps) => {
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>();
  const [isPriceInvalid, setIsPriceInvalid] = useState<boolean>(false);
  const [isDurationInvalid, setIsDurationInvalid] = useState<boolean>(false);
  const listButtonText = "List it!";
  const approveButtonText = "Approve Listing";
  const loadingText = "loading...";
  const [buttonText, setButtonText] = useState<string>();
  const [resolver, setResolver] = useState<boolean>(false);
  const { data: signer } = useWalletClient();
  const { address: account } = useAccount();
  const [isApproved, setIsApproved] = useState<boolean>();
  const [tokenId, setTokenId] = useState<bigint>();
  const client = usePublicClient();
  const router = useRouter();

  const updateState = () => {
    setResolver(!resolver);
  }
  useEffect(() => {
    if(nftItem) {
      if(nftItem.nftData.token_id) {
        setTokenId(BigInt(nftItem.nftData.token_id));
      } else console.error('no token id found');
    }
  },[nftItem]);

  useEffect(() => {
    const resolveIsApproved = async () => {
      if(nftItem && tokenId !== undefined && account){
        if(!nftItem.owner) {
          console.error('no owner found')
          return
        }
        setIsApproved(await getIsApproved(
          client,
          nftItem.contractAddress as `0x${string}`,
          tokenId,
          nftItem.owner,
          mktPlaceContract.address
        ));
      }
    }
    resolveIsApproved();
  }, [account, resolver, nftItem, tokenId]);

  useEffect(() => {
    if(isApproved) setButtonText(listButtonText);
    else if(isApproved !== undefined) setButtonText(approveButtonText);
  }, [isApproved])
  
  const handlePriceChange = (e: any) => {
    // let numValue = parseInt(e.target.value);
    let numValue = parseFloat(e.target.value);
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
    if ((numValue <= 0 || isNaN(numValue)) ) {
      setIsDurationInvalid(true);
      setDuration(undefined);
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
    if(!buttonText || buttonText === loadingText)
      return
    if(!nftItem) {
      console.error('no nft found');
      return
    }
    if(tokenId === undefined){
      console.error('no token id found');
      return
    }
    let hash;
    /** approval call */
    if(!isApproved) {
      setButtonText(loadingText);
      try {
        hash = await approve(
          client,
          signer,
          nftItem.contractAddress,
          tokenId,
          mktPlaceContract.address
        );  
      } catch (err) {
        console.log(err);
        alert('approval failed');
        setButtonText(approveButtonText);
        return
      }
      console.log('success');
      console.log('txhash', hash);
      alert('success');
      updateState()
      // setButtonText(listButtonText);
      return
    }
    /** */
    console.log('isPriceInvalid', isPriceInvalid)
    console.log('isDurationInvalid', isDurationInvalid)
    if(isPriceInvalid || isDurationInvalid) {
      // alert('Set valid values for price and max duration!');
      return
    }
    if(!duration){
      setIsDurationInvalid(true)
      return;
    }

    /** list call */
    setButtonText(loadingText);
    const priceInWei = parseEther(price.toString());
    // const durationInSec = BigNumber.from(duration*24*60*60);
    try {
      hash = await list(
        client,
        signer,
        nftItem.contractAddress,
        tokenId,
        priceInWei,
        BigInt(duration)
      );  
    } catch (err) {
      console.log(err);
      alert('Listing failed')
      setButtonText(listButtonText);
      return
    }
    console.log('success');
    console.log('txhash', hash);
    alert('success');
    // setIsNFTOpen(false);
    router.refresh();
  }

  console.log('isApproved?' , isApproved)
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
            placeholder="0.00"
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
      <button className={styles.listButton} onClick={handleButtonClick}>{buttonText}</button>
    </div>
  );
};
