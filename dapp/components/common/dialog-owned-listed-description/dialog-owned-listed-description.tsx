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

export interface DialogOwnedListedDescriptionProps {
  setIsNFTOpen?: any
  nftItem?: NftItem;
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
  nftItem,
  setApproveData
}: DialogOwnedListedDescriptionProps) => {
  const [duration, setDuration] = useState<number | undefined>();
  const [isDurationInvalid, setIsDurationInvalid] = useState<boolean | undefined>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  // const [rentPrice, setRentPrice] = useState<bigint>();
  // const [maxDuration, setMaxDuration] = useState<bigint>();
  const [tokenId, setTokenId] = useState<bigint>();
  const client = usePublicClient();
  const { chain } = useNetwork();
  const { data: signer } = useWalletClient();
  const { provider } = useSmartAccount();
  const nft = useRealNft({
    contract: nftItem?.contractAddress as `0x${string}`,
    tokenId
  })
  const listing = useListingData({
    contract: nft.data?.contractAddress,
    tokenId: nft.data?.tokenId
  });
  const router = useRouter();

  // console.log('signer', signer);
  
  // console.log('rentPrice', rentPrice?.toString())
  // console.log('maxDuration', maxDuration?.toString())
  // console.log('tokenId', tokenId)

  useEffect(() => {
    if(nftItem) {
      if(nftItem.nftData.token_id) {
        setTokenId(BigInt(nftItem.nftData.token_id));
      } else console.error('no token id found');
    }
  },[nftItem]);

  // useEffect(() => { 
  //   const resolveListData = async() => {
  //     if(!nftItem) 
  //       return
  //     if(tokenId === undefined)
  //       return
  //     let _contractAddress: string;
  //     let _tokenId: bigint;
  //     if(getAddress(nftItem.contractAddress) === receiptsContract.address){
  //       const nftObj = await getNFTByReceipt(client, tokenId);
  //       _contractAddress = nftObj.contractAddress;
  //       _tokenId = nftObj.tokenId;  
  //     } else{
  //       _contractAddress = nftItem.contractAddress;
  //       _tokenId = tokenId;
  //     }
  //     const {price, maxDur} = await getListData(
  //       client, 
  //       _contractAddress,
  //       _tokenId
  //     );
  //     setRentPrice(price);
  //     setMaxDuration(maxDur);
  //   }
  //   resolveListData();
  // }, [client, tokenId]);
  
  const handleChange = (e: any) => {
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
    if(tokenId === undefined) {
      console.error('no token id found');
      return
    }
    if(isLoading)
      return
    setIsLoading(true);
    // let error = null;
    let hash;
    if(provider) {
      try {
        if(!nft.data)
          throw new Error('could not fecth nft info')
        setApproveData({
          type: 'Internal',
          data: {
            targetAddress: getMktPlaceContractAddress(chain?.id),
            value: 0n,
            calldata: delistCallData(nft.data.contractAddress, nft.data.tokenId)
          }
        })
      } catch (err) {
        console.error(err);
        setError(err)
      } finally {
        setIsLoading(false)
        // refetch
      }
    } else {
      try {
        hash = await delist(tokenId, client, signer);
      } catch (err) {
        console.error(err);
        setError(err);
        setIsLoading(false);
        return
      }
      console.log('txHash', hash);
      setIsLoading(false);
      // refetch
    }
  }

  // const name = "Awesome NFT #1"
  // const description = "This is an awesome NFT uhul."
  // const price = 0.0001
  // const maxDuration = 10

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
          <button className={styles.unlistButton} onClick={handleButtonClick}> {isLoading? "loading..." : "Unlist NFT"}</button>
          <div className={styles.warning}>
            <WarningIcon /><span className={styles.warningText}>{`If you unlist your NFT, it'll be removed from the market and won't be available for rent until you relist it.`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
