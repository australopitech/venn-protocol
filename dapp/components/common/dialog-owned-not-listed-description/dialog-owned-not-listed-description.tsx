'use client'
import React, { useLayoutEffect, useEffect, useState } from 'react';
import styles from './dialog-owned-not-listed-description.module.css';
import { list, approve, approveCallData } from '@/utils/call';
import { mktPlaceContract } from '@/utils/contractData';
import { useRouter } from 'next/navigation';
import { isApproved as getIsApproved } from '@/utils/listing-data';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseEther } from 'viem';
import { listCallData } from '@/utils/call';
import { useSmartAccount } from '@/app/account/venn-provider';
import { ApproveData, NftItem } from '@/types';

export interface DialogOwnedNotListedDescriptionProps {
    className?: string;
    index?: number;
    activeAccount?: string;
    context?: string;
    contractAddress?: string;
    tokenId?: bigint;
    owner?: string;
    setIsNFTOpen: any;
    setError: any;
    setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>;
    setTxResolved: any;
}

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
  contractAddress,
  tokenId,
  owner,
  setIsNFTOpen,
  setError,
  setApproveData,
  setTxResolved
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
  const { address: eoa } = useAccount();
  const { provider, address: vsaAddr } = useSmartAccount();
  const [isApproved, setIsApproved] = useState<boolean>();
  // const [tokenId, setTokenId] = useState<bigint>();
  const client = usePublicClient();
  const router = useRouter();

  const updateState = () => {
    setResolver(!resolver);
  }

  // useEffect(() => {
  //   if(nftItem) {
  //     if(nftItem.nftData.token_id) {
  //       setTokenId(BigInt(nftItem.nftData.token_id));
  //     } else console.error('no token id found');
  //   }
  // },[nftItem]);

  useEffect(() => {
    const resolveIsApproved = async () => {
      if(contractAddress && tokenId !== undefined){
        if(!owner) {
          console.error('no owner found')
          return
        }
        setIsApproved(await getIsApproved(
          client,
          contractAddress as `0x${string}`,
          tokenId,
          owner,
          mktPlaceContract.address
        ));
      }
    }
    resolveIsApproved();
  }, [resolver, contractAddress, owner, tokenId]);

  useLayoutEffect(() => {
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
    if(tokenId === undefined || !contractAddress){
      console.error('nft info not found');
      return
    }
    let hash;
    /** approval call */
    if(!isApproved) {
      setButtonText(loadingText);
      try {
        //TODO: VSA CALL
        if(provider) {
          const res = await provider.sendUserOperation({
            target: contractAddress as `0x${string}`,
            value: 0n,
            data: approveCallData(
              mktPlaceContract.address,
              tokenId
            )
          });
          hash = await provider.waitForUserOperationTransaction(res.hash);
        } else {
          hash = await approve(
            client,
            signer,
            contractAddress,
            tokenId,
            mktPlaceContract.address
          );
        }  
      } catch (err: any) {
        console.log(err);
        setError(err)
        setButtonText(approveButtonText);
        return
      }
      console.log('success');
      console.log('txhash', hash);
      // alert('success');
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
    const priceInWei = parseEther(price.toString());
    // const durationInSec = BigNumber.from(duration*24*60*60);
    if(provider) {
      setApproveData({
        type: 'Internal',
        data: {
          targetAddress: mktPlaceContract.address as `0x${string}`,
          value: 0n,
          calldata: listCallData(
            contractAddress as `0x${string}`,
            tokenId,
            priceInWei,
            duration          
          )
        }
      })
      return
    }
    setButtonText(loadingText);
    try {
      hash = await list(
        client,
        signer,
        contractAddress,
        tokenId,
        priceInWei,
        BigInt(duration)
      );  
    } catch (err: any) {
      console.log(err);
      // alert('Listing failed')
      setError(err.message)
      setButtonText(listButtonText);
      return
    }
    console.log('success');
    console.log('txhash', hash);
    // alert('success');
    setTxResolved({ success: true, hash })
    setIsNFTOpen(false);
    // router.refresh();
    // =======> RE-FECTCH <========
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
