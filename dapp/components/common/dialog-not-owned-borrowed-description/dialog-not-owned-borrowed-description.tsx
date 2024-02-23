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
import { timeLeftString } from '@/utils/utils';
import { useTimeLeft } from '@/hooks/nft-data';
import { LoadingComponent } from '../loading/loading';

export interface DialogNotOwnedBorrowedDescriptionProps {
  address?: `0x${string}`;
  contractAddress?: string;
  tokenId?: bigint;
  isRental?: boolean;
}

const dayCutOff = 82800; // 23 h;
const hourCutOff = 3540 // 59 min;


export const DialogNotOwnedBorrowedDescription = ({ 
  address,
  contractAddress,
  tokenId,
  isRental
}: DialogNotOwnedBorrowedDescriptionProps) => {
  const [isLoadingData, setIsLoadingData] = useState(true);
  // const [timeLeft, setTimeLeft] = useState<bigint>();
  // const [block, setBlock] = useState<GetBlockReturnType>();
  // const [isLoading, setIsLoading] = useState<boolean>();
  // const [error, setError] = useState<any>(null);
  // const { address: eoa } = useAccount();
  // const { address: vsa } = useSmartAccount()
  // const { data: blockNum, error: blockErr } = useBlockNumber({ watch: true });
  // const client = usePublicClient();
  const timeLeft = useTimeLeft({
    contract: contractAddress as `0x${string}`,
    tokenId
  });

  useEffect(() => {
    if(!timeLeft.isLoading)
      setTimeout(() => {
        setIsLoadingData(false);
      }, 2000);
  }, [timeLeft])
  

  // useEffect(() => {
  //   const resolveTimeLeft = async() => {
  //     const addr = address ?? vsa;
  //     let endTime: bigint | undefined;
  //     // setIsLoading(true)
  //     try {
  //       endTime = await _getEndTime(client, addr, nftItem);
  //       console.log('endTime', endTime)  
  //     } catch (err) {
  //       console.error(err)
  //       setError(err)
  //     } 
  //     // finally {
  //     //   setIsLoading(false)
  //     // }
  //     // console.log('endTime', endTime?.toString());
  //     if(timestampResponse.error)
  //       setError(timestampResponse.error)
  //     if(endTime && timestampResponse.data) 
  //       setTimeLeft(endTime - timestampResponse.data)
  //   }

  //   resolveTimeLeft();
  //   console.log('timeLeft', timeLeft)
  // }, [vsa, client, timestampResponse]);
  console.log('timeLeft',timeLeft)
  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        {isLoadingData
          ? <div style={{justifyContent: 'center'}}> <LoadingComponent /> </div>
          : timeLeft.error
            ? <>
              <span>
                There was an error fectching info about the renting period. Please try again later <br/>
                {timeLeft.error.message}
              </span>
              </>
            : timeLeft.data
              ? timeLeft.data > 0
                ? <>
                  <span>
                  This NFT is {isRental? "rented by you" : "rented"}. The rent <span className={styles.textHilight}>expires in</span>
                  </span>
                  <span className={styles.timeLeftValue}> 
                    {timeLeftString(timeLeft.data)}
                  </span>
                  </>
                : <>
                  <span>
                  This NFT is {isRental? 'rented by you' : 'rented'}.<br></br> The rent <span className={styles.textHilight}>is expired.</span>
                  </span>
                  </>
              : "Something went wrong"
        }
        {/** holder === signer.address &&
         *  <`Release NFT` button /> */}
      </div>
    </div>
  );
};
