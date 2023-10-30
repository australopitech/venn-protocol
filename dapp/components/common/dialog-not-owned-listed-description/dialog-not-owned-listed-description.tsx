import React, { useEffect, useMemo } from 'react';
import styles from './dialog-not-owned-listed-description.module.css';
import { useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { rent } from '@/utils/call';
import { useSigner, useEthers } from '@usedapp/core';
import { NftItem } from '@/types/typesNftApi.d';
import { mktPlaceContract, receiptsContract } from '@/utils/contractData';
import { isWallet, getListData, getNFTByReceipt } from '../../../utils/utils';
import Router from 'next/router';

export interface DialogNotOwnedListedDescriptionProps {
  index?: number;
  activeAccount?: string;
  nftItem?: NftItem;
  setIsNFTOpen?: any;
  isReceipt?: boolean;
}

async function getFee(provider: any) : Promise<BigNumber> {
  const contract = new ethers.Contract(mktPlaceContract.address, mktPlaceContract.abi, provider);
  return await contract.serviceAliquot();
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
  const [isWalletAccount, setIsWalletAccount] = useState<boolean>();
  const defaultButtonText = "Rent It!";
  const [buttonText, setButtonText] = useState<string>(defaultButtonText);
  const [rentPrice, setRentPrice] = useState<BigNumber>();
  const [maxDuration, setMaxDuration] = useState<BigNumber>();
  const signer = useSigner();
  const { account, library } = useEthers(); 
  // const nft = {maxDuration: 10, price: 0.01}


  useEffect(() => {
    const resolveIsWallet = async() => {
      if(account) 
        setIsWalletAccount(
          await isWallet(library, account)
        );
    }
    resolveIsWallet();
  }, [account]);

  useEffect(() => {
    const resolveListData = async() => {
      if(!nftItem) return
      let contractAddr: string | undefined;
      let tokenId: BigNumber | undefined;
      if(ethers.utils.getAddress(nftItem.contractAddress) === receiptsContract.address) { /**isReceipt */
        const nftObj = await getNFTByReceipt(library, BigNumber.from(nftItem.nftData.token_id));
        contractAddr = nftObj.contractAddress;
        tokenId = nftObj.tokenId;
      } else {
        contractAddr = nftItem?.contractAddress;
        tokenId = BigNumber.from(nftItem?.nftData.token_id);

      }
      if(!contractAddr || tokenId === undefined) return
      const { price, maxDur } = await getListData(library, contractAddr, tokenId);
      setRentPrice(price);
      setMaxDuration(maxDur);
    }

    resolveListData();
    
  }, [library])


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
    } else if ( maxDuration?.lt(numValue) ) {
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
      if(!isWalletAccount) {
        alert("Connect with a rWallet smart account to enable rent tx's");
      } 
      if(!nftItem) {
        console.log('error: no nft found');
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
      const rentValue = rentPrice.mul(duration);
      // console.log('aliq', aliq);
      const fee = rentValue.mul(aliq).div(10000);
      let contractAddr;
      let tokenId;
      if(isReceipt){
        const mkt = new ethers.Contract(mktPlaceContract.address, mktPlaceContract.abi, library);
        const nftObj = await mkt.getNFTbyReceipt(BigNumber.from(nftItem.nftData.token_id));
        contractAddr = nftObj.contractAddress;
        tokenId = nftObj.tokenId;
      } else {
        contractAddr = ethers.utils.getAddress(nftItem.contractAddress);
        tokenId = BigNumber.from(nftItem.nftData.token_id);
      }
      let txReceipt;
      try {
        txReceipt = await rent(
          signer,
          contractAddr,
          tokenId, 
          duration,
          rentValue.add(fee) 
        );
      } catch (error) {
        console.log(error);
        alert('tx failed');
        setButtonText(defaultButtonText);
        return
      }
      alert('tx successful');
      setButtonText(defaultButtonText);
      // setIsNFTOpen(false);
      Router.reload();
    }

    console.log('isWalletAccount', isWalletAccount);

    return (
      <div className={styles['bodyDescriptionContainer']}>
        <div className={styles.divider}></div>
        <h2 className={styles['bodyDescription']}><span className={styles.textHilight}>Rent</span> this NFT!</h2>
        <h3 className={styles['priceDescription']}>
            Price: <span className={styles['priceCurrency']}>{rentPrice ? ethers.utils.formatEther(rentPrice) : ""} ETH/day</span>
        </h3>
        <div className={styles.priceDescription}>{`Maximum loan period: ${maxDuration?.toString()} ${maxDuration?.eq(1)  ? 'day' : 'days'}`}</div>
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
        {!isWalletAccount && 
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
