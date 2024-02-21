'use client'
import React, { useEffect, useState } from 'react';
import styles from './dialog-not-owned-borrowed-description.module.css';
import { NftItem } from '@/types';
import smartAccount from '../../../utils/contractData/SmartAccount.json';
import { receiptsContract } from '@/utils/contractData';
import { getEndTime, getNFTByReceipt, ownerOf } from '@/utils/listing-data';
import { getAddress, GetBlockReturnType } from 'viem';
import { useAccount, useBlockNumber, usePublicClient } from 'wagmi';
import { useTimestamp } from '@/hooks/block-data';
import { useSmartAccount } from '@/app/account/venn-provider';


export interface DialogNotOwnedBorrowedDescriptionProps {
  address?: `0x${string}`;
  nftItem?: NftItem;
  isRental?: boolean;
}

const dayCutOff = 82800; // 23 h;
const hourCutOff = 3540 // 59 min;

async function _getEndTime(
  client: any, 
  account?: `0x${string}`, 
  nftItem?: NftItem,
) {
  if(!account || !nftItem) return
  if(!nftItem.nftData.token_id) 
    throw new Error('no token id found');
  let contractAddr: string;
  let tokenId: bigint;
  let acc: `0x${string}`;
  if(getAddress(nftItem.contractAddress) === receiptsContract.address) {
    const nftObj = await getNFTByReceipt(
      client,
      BigInt(nftItem.nftData.token_id)
    );
    contractAddr = nftObj.contractAddress;
    tokenId = nftObj.tokenId;
    acc = await ownerOf(client, contractAddr, tokenId);
  } else {
    contractAddr = nftItem.contractAddress;
    tokenId = BigInt(nftItem.nftData.token_id);
    acc = account;
  }
  console.log('getEndTime inputs', acc, contractAddr, tokenId)
  return getEndTime(client, acc, contractAddr, tokenId)
}

export const DialogNotOwnedBorrowedDescription = ({ 
  address,
  nftItem,
  isRental
}: DialogNotOwnedBorrowedDescriptionProps) => {
  const [timeLeft, setTimeLeft] = useState<bigint>();
  // const [block, setBlock] = useState<GetBlockReturnType>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<any>(null);
  // const { address: eoa } = useAccount();
  const { address: vsa } = useSmartAccount()
  // const { data: blockNum, error: blockErr } = useBlockNumber({ watch: true });
  const client = usePublicClient();
  const timestampResponse = useTimestamp();
  console.log('timestamp', timestampResponse.data)
  

  useEffect(() => {
    const resolveTimeLeft = async() => {
      const addr = address ?? vsa;
      let endTime: bigint | undefined;
      // setIsLoading(true)
      try {
        endTime = await _getEndTime(client, addr, nftItem);
        console.log('endTime', endTime)  
      } catch (err) {
        console.error(err)
        setError(err)
      } 
      // finally {
      //   setIsLoading(false)
      // }
      // console.log('endTime', endTime?.toString());
      if(timestampResponse.error)
        setError(timestampResponse.error)
      if(endTime && timestampResponse.data) 
        setTimeLeft(endTime - timestampResponse.data)
    }

    resolveTimeLeft();
    console.log('timeLeft', timeLeft)
  }, [vsa, client, timestampResponse]);

  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        {
        timeLeft
          ? timeLeft > 0
            ? <>
            <span>
            This NFT is {isRental? "rented by you" : "rented"}. The rent <span className={styles.textHilight}>expires in</span>
            </span>
            <span className={styles.timeLeftValue}> 
              {timeLeft >= dayCutOff
                ? `${parseFloat(String(timeLeft/86400n)).toFixed(1)} ${timeLeft/86400n < 2n ? 'day' : 'days'}`
                : timeLeft >= hourCutOff
                  ? `${parseFloat(String(timeLeft/3600n)).toFixed(1)} ${timeLeft/3600n < 2n ? 'hour' : 'hours'}`
                  : timeLeft >= 60n
                    ? `${parseFloat(String(timeLeft/60n)).toFixed(1)} ${timeLeft < 120n ? 'minute' : 'minutes' }`
                    : 'less than a minute'
              } 
            </span>
            </>
            : <>
                <span>
                This NFT is {isRental? 'rented by you' : 'rented'}.<br></br> The rent <span className={styles.textHilight}>is expired.</span>
                </span>
                </>
          : error &&
            <>
            <span>
              There was an error fectching info about the renting period. Please try again later <br/>
              {error?.message}
            </span>
            </>
        }
        {/** holder === signer.address &&
         *  <`Release NFT` button /> */}
      </div>
    </div>
  );
};
