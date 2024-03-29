'use client'
import Image from 'next/image';
import styles from './nft-card.module.css';
import classNames from 'classnames';
import { useMemo, useEffect, useState } from 'react';
import { 
  ownerOf, checkIsListed, checkIsRentedOut, getListData, getNFTByReceipt, isRental as checkIsRental, checkPrice
 } from '@/utils/listing-data';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { baseGoerli } from 'viem/chains';
import { convertFromSec, convertUnitToSec } from '@/utils/utils';
import { formatEther, getAddress } from 'viem';
import { useListingData } from '@/hooks/nft-data';
import { getReceiptsContractAddress } from '@/utils/contractData';
import { useSmartAccount } from '@/app/account/venn-provider';

export interface NftCardProps {
  imageURI: string;
  name: string;
  contractAddress: string;
  tokenId?: bigint;
  // price?: number;
  // isRented?: boolean;
  // expireDate?: string;
  address?: string;
  currentPage?: string | '';
  onClick: any;
  holderAddress?: string;
}

export default function NftCard ({ 
  imageURI, 
  name,
  contractAddress,
  tokenId, 
  address, 
  currentPage,
  onClick,
  holderAddress
}: NftCardProps) {
  
  // const { data: signer } = useWalletClient();
  const [error, setError] = useState<any>();
  const [holder, setHolder] = useState<string>();
  const [isListed, setIsListed] = useState<boolean>();
  // const [rentPrice , setRentPrice] = useState<bigint>();
  const [isRentedOut, setIsRentedOut] = useState<boolean>();
  const [isRental, setIsRental] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  
  const { address: vsa } = useSmartAccount();
  const { address: account, isDisconnected } = useAccount();
  const client = usePublicClient();

  const listing = useListingData({
    contract: contractAddress as `0x${string}`,
    tokenId
  });
  const memoizedListing = useMemo(() => listing, [listing])

  // console.log('tokenid/isrental',tokenId?.toString(),isRental)
  // console.log(
  //   name,
  //   'price', rentPrice,
  //   // 'holder', holder,
  //   // 'isListed', isListed,
  //   // 'isRental', isRental,
  //   // 'isRentedOut', isRentedOut,
  //   // 'loading', loading
  // )

  // const onBurn = async () => {
  //   try {
  //     if(signer && tokenId) await burnMockNFT(signer, tokenId);
  //     else throw new Error('missing arg/signer');
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  // console.log('imageURI', imageURI);
  
  useEffect(() => {
    const fetchHolder = async () => {
      if (holderAddress) {
        setHolder(holderAddress);
      }
      else {
        if(tokenId !== undefined) 
          try{
            setHolder(await ownerOf(client, contractAddress, tokenId));
          } catch(err) {
            console.error(err)
          }
      }
    }

    fetchHolder();
  },[]);

  useEffect(() => {
    console.log('render')
    if(tokenId === undefined) {
      console.error('error: no token id found');
      setError({message: 'error: no token id found'})
      return
    }
    
    const isReceipt = getAddress(contractAddress) === getReceiptsContractAddress();
    
    // const resolvePrice = async () => {
    //   setRentPrice(await checkPrice(contractAddress, tokenId, isReceipt, client));
    // }

    // const resolveIsListed = async () => {
    //   setIsListed( await checkIsListed(isReceipt, contractAddress, tokenId, client));
    // }

    if(listing.data?.maxDur !== undefined) setIsListed(listing.data?.maxDur > 0n);
    
    const resolveIsRentedOut = async () => {
      const res = await checkIsRentedOut(contractAddress, tokenId, isReceipt, holder, client);
      // console.log('checkIsRentedOut response', res);
      setIsRentedOut(res)
    }

    const resolveIsRental = async() => {
      if(address) {
        setIsRental(await checkIsRental(
          contractAddress,
          tokenId,
          address,
          client          
        ));
        return
      }
      if(account)
        setIsRental( await checkIsRental(
          contractAddress,
          tokenId,
          vsa ?? account,
          client          
        ));
      if(isDisconnected)
          setIsRental(false);
    }

    
    resolveIsRentedOut();
    resolveIsRental();
    

  }, [client, holder, account, memoizedListing]);

  useEffect(() => {
    console.log('render')
    if(error || listing.error) {
      setLoading(false);
    } else if(
      listing.isLoading === false &&
      isListed !== undefined &&
      isRentedOut !== undefined &&
      isRental !== undefined
    ) setLoading(false);
  },[isListed, isRentedOut, isRental, memoizedListing])

  // console.log(tokenId, contractAddress)
  // console.log(tokenId, 'listing', listing)
  // console.log(tokenId, 'loading', loading);
  // console.log(tokenId, 'error', error)
  // console.log('tokenId', tokenId, 'isListed', isListed, 'isRentedOut', isRentedOut, 'isRental', isRental, 'isReceipt', getAddress(contractAddress) === getReceiptsContractAddress() )
  
  return (
    <div className={classNames(styles.nftCardContainer, currentPage === 'market' ? styles.nftCardMarketContainer : '')}>
      <div className={styles.nftCardImageContainer} onClick={onClick}>
        <img width="100%" height="100%" src={imageURI} alt='NFT Image'/>
      </div>
      <div className={styles.nftCardInfo}>
        <span>{name}</span>
        {loading
         ? <span className={styles.notListed}>Loading...</span>
         : (error || listing.error)
          ? <span className={styles.notListed}>Oops...an error ocurred!</span>
          : isListed
            ? (isRentedOut
                ? <span className={styles.rented}>
                    {/* {`Rent expires in ${expireDate || 'NaN'}`} */}
                    Rented
                  </span>
                : <span className={styles.listed}>
                    Rent price:
                    <span className={styles.price}>
                      {listing.data?.price != undefined ? `${parseFloat(formatEther(convertUnitToSec(listing.data.price, 'day'))).toPrecision(2)} MATIC/Day` : 'err'}
                    </span>
                  </span>
              )
            : (isRentedOut
              ? <span className={styles.rented}>
                Rented
                </span>
              : <span className={styles.notListed}>
                  Not listed
                </span>)
          }
        {/* {(getAddress(contractAddress) === getTestNFTcontractAddress()) && 
          <button onClick={() => onBurn()}>burn</button>
        } */}
      </div> 
    </div>
  );
}