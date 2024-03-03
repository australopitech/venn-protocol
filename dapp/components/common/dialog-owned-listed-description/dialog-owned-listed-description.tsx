'use client'
import React, { useEffect, useState } from 'react';
import styles from './dialog-owned-listed-description.module.css';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { ApproveData, NftItem } from '@/types';
import { delist, delistCallData  } from '@/utils/call';
import { getListData, getNFTByReceipt } from '@/utils/listing-data';
import { getMktPlaceContractAddress, receiptsContract } from '@/utils/contractData';
import { useNetwork, usePublicClient, useWalletClient } from 'wagmi';
import { formatEther } from 'viem';
import { useListingData, useRealNft } from '@/hooks/nft-data';
import { useSmartAccount } from '@/app/account/venn-provider';
import { useRefetchAddressData } from '@/hooks/address-data';
import { LoadingComponent } from '../loading/loading';

export interface DialogOwnedListedDescriptionProps {
  setIsNFTOpen: any;
  setTxResolved: any;
  txLoading: boolean;
  setError: any;
  contractAddress?: string;
  tokenId?: bigint;
  setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>
}

// function EditableInput() {
//   const [value, setValue] = useState('1'); // Default or initial value for the input
//   const [isEditable, setIsEditable] = useState(false); // State to track whether input is editable

//   const handleEdit = () => {
//     setIsEditable(true);
//   }

//   const handleSubmit = () => {
//     setIsEditable(false);
//   }

//   return (
//     <div>
//       {isEditable ? (
//         <>
//           <div>
//             <input 
//               type="text" 
//               value={value}
//               onChange={(e) => setValue(e.target.value)}
//             />
//             <div>
//               ETH/day
//             </div>
//           </div>
//           <button onClick={handleSubmit}>Done</button>
//         </>
//       ) : (
//         <>
//           <span>{`${value} ETH/day`}</span>
//           <button onClick={handleEdit}>Edit</button>
//         </>
//       )}
//     </div>
//   );
// }

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

export const DialogOwnedListedDescription = ({ 
  setIsNFTOpen,
  setTxResolved,
  txLoading,
  setError,
  contractAddress,
  tokenId,
  setApproveData
}: DialogOwnedListedDescriptionProps) => {
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<any>(null);
  const client = usePublicClient();
  const { chain } = useNetwork();
  const { data: signer } = useWalletClient();
  const { provider, address: vsa } = useSmartAccount();
  const nft = useRealNft({
    contract: contractAddress as `0x${string}`,
    tokenId
  })
  const listing = useListingData(nft.data);
  // const refecthData = useRefetchAddressData();

  useEffect(() => {
    if(!listing.isLoading && !nft.isLoading)
      setTimeout(() => {
        setLoadingInfo(false);
      }, 2000);
  }, [listing, nft]);

  const handleButtonClick = async() => {
    if(!signer) {
      alert('Connect your wallet!')
      return
    }
    if(tokenId === undefined) {
      setError('no token id found');
      return
    }
    if(isLoading || txLoading)
      return
    setIsLoading(true);
    let hash;
    try {
      if(provider) {
        if(!nft.data)
          throw new Error('could not fecth nft info');
        setApproveData({
          type: 'Internal',
          data: {
            targetAddress: getMktPlaceContractAddress(chain?.id),
            value: 0n,
            calldata: delistCallData(nft.data.contract, nft.data.tokenId)
          }
        });
        setIsLoading(false)
      } else {
        hash = await delist(tokenId, client, signer);
        setTxResolved({ success: true, hash });
      }
    } catch (err) {
      console.error(err);
      setError(err);
      setIsLoading(false)
      return
    }
  }

  if(loadingInfo)
    return (
      <div className={styles.bodyDescriptionContainer}>
        <div className={styles.divider}></div>
        <div className={styles.bodyDescription}>
          {/* Please Wait.<br />Loading NFT info... */}
          <div className={styles.loadingContainer}>
            <LoadingComponent />
          </div>
        </div>
      </div>
  )


  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        <span>This NFT <span className={styles.textHilight}>is listed!</span></span>
        <br />
        {/* <span>Price: </span><EditableInput /> */}
        <span className={styles.nftLoanInfo}>{`Price: ${listing.data?.price !== undefined? formatEther(listing.data.price): ""} ${chain?.nativeCurrency.symbol}/Day`}</span>
        <span className={styles.nftLoanInfo}>{`Maximum loan duration: ${listing.data?.maxDur? listing.data.maxDur.toString() : ""} ${listing.data?.maxDur? listing.data.maxDur <= 1n ? 'Day' : 'Days' : 'Days'}`}</span>
        <br />
        {/* <span className={styles.unlistInfo}>Would you like to unlist this NFT?</span> */}
        <div className={styles.unlistContainer}>
          <button className={styles.unlistButton} onClick={handleButtonClick}> {(isLoading || txLoading) ? <LoadingComponent/> : "Unlist NFT"}</button>
          <div className={styles.warning}>
            <WarningIcon /><span className={styles.warningText}>{`If you unlist your NFT, it'll be removed from the market and won't be available for rent until you relist it.`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
