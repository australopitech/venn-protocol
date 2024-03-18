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
import { LoadingComponent, LoadingDots } from '../loading/loading';

export interface DialogOwnedRentedDescriptionProps {
  isListed?: boolean;
  contractAddress?: string;
  tokenId?: bigint;
  setIsNFTOpen: any;
  setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>
  setTxResolved: any;
  setError: any;
  txLoading: boolean;
}

const WarningIcon = () => {
  return (
    // <svg width="20px" height="20px" viewBox="0 0 61.44 61.44" xmlns="http://www.w3.org/2000/svg">
    //   <path fill="#000000" d="M30.72 3.84a26.88 26.88 0 1 1 0 53.76 26.88 26.88 0 0 1 0 -53.76zm0 49.92a23.04 23.04 0 0 0 0 -46.08 23.04 23.04 0 0 0 0 46.08zm2.88 -10.56a2.88 2.88 0 1 1 -5.76 0 2.88 2.88 0 0 1 5.76 0zm-2.88 -27.84a1.92 1.92 0 0 1 1.92 1.92v17.28a1.92 1.92 0 0 1 -3.84 0V17.28a1.92 1.92 0 0 1 1.92 -1.92z"/>
    // </svg>
    <svg className={styles.warningIcon}  viewBox="0 0 61.44 61.44" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path 
      fill="#D52941" 
      stroke="#D52941" 
      strokeWidth="2" 
      strokeLinecap="round"
      d="M30.72 3.84a26.88 26.88 0 1 1 0 53.76 26.88 26.88 0 0 1 0 -53.76zm0 49.92a23.04 23.04 0 0 0 0 -46.08 23.04 23.04 0 0 0 0 46.08zm2.88 -10.56a2.88 2.88 0 1 1 -5.76 0 2.88 2.88 0 0 1 5.76 0zm-2.88 -27.84a1.92 1.92 0 0 1 1.92 1.92v17.28a1.92 1.92 0 0 1 -3.84 0V17.28a1.92 1.92 0 0 1 1.92 -1.92z"/>
    </svg>

  )
}

export const DialogOwnedRentedDescription = ({ 
  isListed,
  contractAddress,
  tokenId,
  setIsNFTOpen,
  setApproveData,
  setTxResolved,
  setError,
  txLoading
}: DialogOwnedRentedDescriptionProps) => {
  // const [timeLeft, setTimeLeft] = useState<bigint>();
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [tokenId, setTokenId] = useState<bigint>();
  // const [error, setError] = useState<any>(null);
  const { data: signer } = useWalletClient();
  const { provider } = useSmartAccount();
  const client = usePublicClient();
  const nft = useRealNft({ 
    contract: contractAddress as `0x${string}`,
    tokenId
  });

  const holder = useHolder(nft.data);
  // const timestamp = useTimestamp();
  const timeLeft = useTimeLeft({
    contract: contractAddress as `0x${string}`, 
    tokenId
  })
  

  useEffect(() => {
    if(!nft.isLoading && !holder.isLoading && !timeLeft.isLoading)
      setTimeout(() => {
        setLoadingInfo(false)
      }, 2000);
  }, [nft.isLoading, holder.isLoading, timeLeft.isLoading])
  

  const handleButtonClick = async(method: 'delist' | 'pull') => {
    if(!signer) {
      alert('Connect your wallet!')
      return
    }
    if(isLoading || txLoading) return
    if(!nft.data?.contract || nft.data.tokenId === undefined) {
      console.error(nft.error ?? 'error: nft info not found');
      setError(nft.error ?? { message: 'error: nft info not found' });
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
      setTxResolved({ success: true, hash });
      setIsLoading(false);
      // refetch
    }
  }

  if(loadingInfo) 
      return (
        <div className={styles.bodyDescriptionContainer}>
          <div className={styles.divider}></div>
          <div className={styles.bodyLoading}>
            <LoadingComponent />
          </div>
        </div>
      )

  // if(error || nft.error || holder.error) return (
  //   <div className={styles.bodyDescriptionContainer}>
  //     <div className={styles.divider}></div>
  //     <div className={styles.bodyDescription}>
  //       An error ocurred!
  //       <span>
  //         {error ? error.message
  //           : nft.error ? nft.error.message
  //           : holder.error ? holder.error.message
  //           : ''
  //         }
  //       </span>
  //     </div>
  //   </div>

  // )

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
            <button className={styles.unlistButton} onClick={() => handleButtonClick('pull')}> {(isLoading || txLoading)? <LoadingDots /> : isListed? 'Pull NFT' : 'Retrieve NFT'} </button>
            <div className={styles.warning}>
              <WarningIcon /><span className={styles.warningText}>{
              isListed ? `Pull your NFT back to the Market so it can be rented again.` : `Get your NFT back to your account and get refunded the 'Pull Fee'.`
              }</span>
            </div>
          </div>
        }
        {isListed &&
          <div>
            <button className={styles.unlistButton} onClick={() => handleButtonClick('delist')}> {(isLoading || txLoading)? <LoadingDots /> : 'Unlist NFT'} </button>
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
