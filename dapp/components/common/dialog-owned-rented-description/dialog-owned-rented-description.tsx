'use client'
import React, { useEffect, useMemo, useState } from 'react';
import styles from './dialog-owned-rented-description.module.css';
import { delist, pull, resolvePullOrDelistCallData } from '@/utils/call';
import { ApproveData, NftItem } from '@/types';
import { usePublicClient, useWalletClient } from 'wagmi';
import { getMktPlaceContractAddress } from '@/utils/contractData';
import { useSmartAccount } from '@/app/account/venn-provider';
import { useHolder, useRealNft, useTimeLeft } from '@/hooks/nft-data';
import { timeLeftString } from '@/utils/utils';

export interface DialogOwnedRentedDescriptionProps {
  isListed?: boolean;
  nftItem?: NftItem;
  setIsNFTOpen: any;
  setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>
}

const WarningIcon = () => {
  return (
    // <svg width="20px" height="20px" viewBox="0 0 61.44 61.44" xmlns="http://www.w3.org/2000/svg">
    //   <path fill="#000000" d="M30.72 3.84a26.88 26.88 0 1 1 0 53.76 26.88 26.88 0 0 1 0 -53.76zm0 49.92a23.04 23.04 0 0 0 0 -46.08 23.04 23.04 0 0 0 0 46.08zm2.88 -10.56a2.88 2.88 0 1 1 -5.76 0 2.88 2.88 0 0 1 5.76 0zm-2.88 -27.84a1.92 1.92 0 0 1 1.92 1.92v17.28a1.92 1.92 0 0 1 -3.84 0V17.28a1.92 1.92 0 0 1 1.92 -1.92z"/>
    // </svg>
    <svg className={styles.warningIcon} width="18px" height="18px" viewBox="0 0 61.44 61.44" xmlns="http://www.w3.org/2000/svg">
    <path 
      fill="#D52941" 
      stroke="#D52941" 
      stroke-width="2" 
      stroke-linecap="round"
      d="M30.72 3.84a26.88 26.88 0 1 1 0 53.76 26.88 26.88 0 0 1 0 -53.76zm0 49.92a23.04 23.04 0 0 0 0 -46.08 23.04 23.04 0 0 0 0 46.08zm2.88 -10.56a2.88 2.88 0 1 1 -5.76 0 2.88 2.88 0 0 1 5.76 0zm-2.88 -27.84a1.92 1.92 0 0 1 1.92 1.92v17.28a1.92 1.92 0 0 1 -3.84 0V17.28a1.92 1.92 0 0 1 1.92 -1.92z"/>
    </svg>

  )
}

export const DialogOwnedRentedDescription = ({ 
  isListed,
  nftItem,
  setIsNFTOpen,
  setApproveData
}: DialogOwnedRentedDescriptionProps) => {
  // const [timeLeft, setTimeLeft] = useState<bigint>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<bigint>();
  const [error, setError] = useState<any>(null);
  const { data: signer } = useWalletClient();
  const { provider } = useSmartAccount();
  const client = usePublicClient();
  const nft = useRealNft({ 
    contract: nftItem?.contractAddress as `0x${string}`,
    tokenId
  });

  const memoizedData = useMemo(() => nft.data, [nft.data?.contract, nft.data?.tokenId]);
  const holder = useHolder(memoizedData);
  // const timestamp = useTimestamp();
  const timeLeft = useTimeLeft({
    contract: nftItem?.contractAddress as `0x${string}`, 
    tokenId: tokenId
  })
  
  // console.log('timeLeft', timeLeft);
  
  useEffect(() => {
    if(nftItem) {
      if(nftItem.nftData.token_id) {
        setTokenId(BigInt(nftItem.nftData.token_id));
      } else {
        console.error('no token id found');
        setError({message: 'error: no token id found'})
      }
    }
  },[nftItem]);
  
  // useEffect(() => {
  //   const resolveTimeLeft = async() => {
  //     if(tokenId === undefined || !nftItem)
  //       return;
  //     if(!nft.data || !holder.data)
  //       return
  //     const endTime = await getEndTime(
  //       client,
  //       holder.data,
  //       nft.data.contract,
  //       nft.data.tokenId
  //     );
  //     // console.log('endTime', endTime?.toString())
  //     if(endTime && timestamp.data) setTimeLeft(endTime - timestamp.data)
  //   }
  //   try {
  //     resolveTimeLeft();  
  //   } catch (err) {
  //     console.error(err);
  //     setError(err)
  //   }
    
  // }, [tokenId, timestamp, nft, holder]);

  const handleButtonClick = async(method: 'delist' | 'pull') => {
    if(!signer) {
      alert('Connect your wallet!')
      return
    }
    if(isLoading) return
    if(!nft.data?.contract || !nft.data.tokenId) {
      console.error('error: nft info not found');
      setError({ message: 'error: nft info not found' });
      return
    }
    if(tokenId === undefined) {
      console.error('no token/receipt id found');
      setError({ message: 'error: no token/receipt id found' });
      return
    }
    setIsLoading(true);
    if(provider) {
      try {
        const calldata = resolvePullOrDelistCallData(method, nft.data.contract, nft.data.tokenId);
        setApproveData({
          type: 'Internal',
          data: {
            targetAddress: getMktPlaceContractAddress(),
            value: 0n,
            calldata
          }
        })
      } catch(err) {
        console.error(err);
        setError(err)
      } finally {
        setIsLoading(false);
      }      
    } else {
      let hash;
      try {
        hash = 
          method === 'delist' ? await delist( 
            tokenId,
            client,
            signer,
          ) : method === 'pull' ? await pull(
            tokenId,
            client,
            signer
          ) : 'unsuported'
        if(hash === 'unsuported')
            throw new Error('unsuported method');
      } catch (err) {
        console.error(err);
        setError(err)
        setIsLoading(false);
        return;
      }
      console.log('txHash', hash);
      alert('success');
      setIsLoading(false);
      setIsNFTOpen(false);
      // refetch
    }
  }

  if(
    nft.isLoading ||
    holder.isLoading
    ) 
      return (
        <div className={styles.bodyDescriptionContainer}>
          <div className={styles.divider}></div>
          <div className={styles.bodyDescription}>
            Please Wait. Loading NFT info...
          </div>
        </div>
      )

  if(error || nft.error || holder.error) return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        An error ocurred!
        <span>
          {error ? error.message
            : nft.error ? nft.error.message
            : holder.error ? holder.error.message
            : ''
          }
        </span>
      </div>
    </div>

  )

  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        <span>
          This NFT is currently rented to another user.
        </span>
        <span className={styles.timeLeftValue}> 
          {timeLeft.data !== undefined ? 'Time Left: ' + timeLeftString(timeLeft.data) : ''}
        </span>
      </div>
      
      <div className={styles.unlistContainer}>
        {timeLeft.data!==undefined && timeLeft.data <= 0n && holder.data !== getMktPlaceContractAddress() &&
          <div>
            <button className={styles.unlistButton} onClick={() => handleButtonClick('pull')}> {isLoading? 'loading...' : isListed? 'Pull NFT' : 'Retrieve NFT'} </button>
            <div className={styles.warning}>
              <WarningIcon /><span className={styles.warningText}>{
              isListed ? `Pull your NFT back to the Market so it can be rented again.` : `Get your NFT back to your account and get refunded the 'Pull Fee'.`
              }</span>
            </div>
          </div>
        }
        {isListed &&
          <div>
            <button className={styles.unlistButton} onClick={() => handleButtonClick('delist')}> {isLoading? 'loading...' : 'Unlist NFT'} </button>
            <div className={styles.warning}>
              <WarningIcon /><span className={styles.warningText}>{
              timeLeft.data
              ? timeLeft.data > 0 
                  ? `If you unlist your NFT, it'll be removed from the market after the current rental ends and won't be available for rent until you relist it.`
                  : `If you unlist your NFT, it'll be retrieved and sent straight to your account. It won't be available for rent until you relist it. You will be refunded the 'Pull Fee'.`
              :''
              }</span>
            </div>
          </div>
        }
      </div>
    </div>
  );
};
