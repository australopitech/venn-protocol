'use client'
import React, { useEffect, useMemo } from 'react';
import styles from './dialog-not-owned-listed-description.module.css';
import { useState } from 'react';
// import { ethers, BigNumber } from 'ethers';
import { rent } from '@/utils/call';
// import { useSigner, useEthers } from '@usedapp/core';
import { NftItem } from '@/types/typesNftApi.d';
import { NftObj } from '@/types/nftObj';
import { mktPlaceContract, receiptsContract } from '@/utils/contractData';
import { isSmartAccount, getListData, getNFTByReceipt } from '../../../utils/listing-data';
import Router from 'next/router';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { getAddress, formatEther } from 'viem';

export interface DialogNotOwnedListedDescriptionProps {
  index?: number;
  activeAccount?: string;
  nftItem?: NftItem;
  setIsNFTOpen?: any;
  isReceipt?: boolean;
}

const mktPlaceAddr = mktPlaceContract.address as `0x${string}`;


async function getFee(provider: any) : Promise<bigint> {
  // const contract = new ethers.Contract(mktPlaceAddr, mktPlaceContract.abi, provider);
  // return await contract.serviceAliquot();
  return await provider.readContract({
    address: mktPlaceAddr,
    abi: mktPlaceContract.abi,
    functionName: 'serviceAliquot',
  });
}


// let nft: any;
// let _title: string | undefined;
// let _name: string | undefined;

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogNotOwnedListedDescription = ({ index, activeAccount, nftItem, setIsNFTOpen, isReceipt }: DialogNotOwnedListedDescriptionProps) => {
  const [duration, setDuration] = useState<number | undefined>();
  const [isDurationInvalid, setIsDurationInvalid] = useState<boolean | undefined>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSmartaccount, setIsSmartaccount] = useState<boolean>();
  const defaultButtonText = "Rent It!";
  const [buttonText, setButtonText] = useState<string>(defaultButtonText);
  const [rentPrice, setRentPrice] = useState<bigint>();
  const [maxDuration, setMaxDuration] = useState<bigint>();
  // const signer = useSigner();
  const { data: signer } = useWalletClient();
  // const { account, library } = useEthers(); 
  const { address: account } = useAccount();
  const client = usePublicClient();
  // const nft = {maxDuration: 10, price: 0.01}


  useEffect(() => {
    const resolveIsSmartAccount = async() => {
      if(account) 
        setIsSmartaccount(
          await isSmartAccount(client, account)
        );
    }
    resolveIsSmartAccount();
  }, [account]);

  useEffect(() => {
    const resolveListData = async() => {
      if(!nftItem) return
      if(!nftItem.nftData.token_id) {
        console.error('no token id found');
        return
      }
      let contractAddr: string;
      let tokenId: bigint;
      if(getAddress(nftItem.contractAddress) === receiptsContract.address) { /**isReceipt */
        const nftObj = await getNFTByReceipt(client, BigInt(nftItem.nftData.token_id));
        contractAddr = nftObj.contractAddress;
        tokenId = nftObj.tokenId;
      } else {
        contractAddr = nftItem.contractAddress;
        tokenId = BigInt(nftItem.nftData.token_id);
      }
      if(!contractAddr || tokenId === undefined) return
      const { price, maxDur } = await getListData(client, contractAddr, tokenId);
      setRentPrice(price);
      setMaxDuration(maxDur);
    }

    resolveListData();
    
  }, [client])


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
    } else if ( maxDuration! < BigInt(numValue) ) {
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
      if(!isSmartaccount) {
        alert("Connect with a rWallet smart account to enable rent tx's");
      } 
      if(!nftItem || !nftItem.nftData.token_id) {
        console.error('missing nft info');
        return
      }
      if(!duration) {
        alert('Enter a value for duration');
        return
      }
      // const { price } = await getListData(signer, nftItem.contractAddress, BigNumber.from(nftItem.nftData.token_id));
      const aliq = await getFee(signer);
      if(rentPrice === undefined || aliq === undefined) {
        console.log('error: could not get price or service-aliquot');
        return
      }
      setButtonText('Loading...');
      const rentValue = rentPrice * BigInt(duration);
      // console.log('aliq', aliq);
      const fee = (rentValue * aliq) / BigInt(10000);
      let contractAddr;
      let tokenId;
      if(isReceipt){
        // const mkt = new ethers.Contract(mktPlaceAddr, mktPlaceContract.abi, client);
        // const nftObj = await mkt.getNFTbyReceipt(BigNumber.from(nftItem.nftData.token_id));
        const nftObj = await client.readContract({
          address: mktPlaceAddr,
          abi: mktPlaceContract.abi,
          functionName: 'getNFTbyReceipt',
          args: [BigInt(nftItem.nftData.token_id)]
        }) as NftObj;
        contractAddr = nftObj.contractAddress;
        tokenId = nftObj.tokenId;
      } else {
        contractAddr = getAddress(nftItem.contractAddress);
        tokenId = BigInt(nftItem.nftData.token_id);
      }
      let txReceipt;
      try {
        txReceipt = await rent(
          signer,
          contractAddr,
          tokenId, 
          duration,
          rentValue + fee 
        );
      } catch (error) {
        console.error(error);
        alert('tx failed');
        setButtonText(defaultButtonText);
        return
      }
      alert('tx successful');
      setButtonText(defaultButtonText);
      // setIsNFTOpen(false);
      Router.reload();
    }


    return (
      <div className={styles['bodyDescriptionContainer']}>
        <div className={styles.divider}></div>
        <h2 className={styles['bodyDescription']}><span className={styles.textHilight}>Rent</span> this NFT!</h2>
        <h3 className={styles['priceDescription']}>
            Price: <span className={styles['priceCurrency']}>{rentPrice ? formatEther(rentPrice) : ""} ETH/day</span>
        </h3>
        <div className={styles.priceDescription}>{`Maximum loan period: ${maxDuration?.toString()} ${maxDuration === BigInt(1)  ? 'day' : 'days'}`}</div>
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
        {isSmartaccount &&
          <button className={styles.borrowButton} onClick={handleButtonClick}>{ buttonText}</button>}
        {!isSmartaccount && 
          <div className={styles.notConnectedMessage}> 
            <button className={styles.notConnectedButton} onClick={handleButtonClick}>{ buttonText}</button>
            <p>
              <span className={styles.textLink}>Click here</span> to create a rWallet Smart Account!
            </p>
          </div>
        } 
      </div>
  );
};
