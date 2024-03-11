'use client'
import Image from 'next/image';
import styles from './nft-card.module.css';
import classNames from 'classnames';
import { useMemo, useEffect, useState } from 'react';
import { 
  ownerOf, checkIsListed, checkIsRentedOut, getListData, getNFTByReceipt, isRental as checkIsRental, checkPrice
 } from '@/utils/listing-data';
import { receiptsContract } from '@/utils/contractData';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { baseGoerli } from 'viem/chains';
import { convertFromSec, convertUnitToSec } from '@/utils/utils';
import { formatEther, getAddress } from 'viem';
import { burnMockNFT, getTestNFTcontractAddress } from '@/utils/demo';

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
  const { address: account, isDisconnected } = useAccount();
  const [holder, setHolder] = useState<string>();
  const [isListed, setIsListed] = useState<boolean>();
  const [rentPrice , setRentPrice] = useState<bigint>();
  const [isRentedOut, setIsRentedOut] = useState<boolean>();
  const [isRental, setIsRental] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const client = usePublicClient();
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
        if(tokenId !== undefined) setHolder(await ownerOf(client, contractAddress, tokenId));
      }
    }

    fetchHolder();
  },[]);

  useEffect(() => {
    if(tokenId === undefined) {
      console.error('no token id found');
      return
    }
    
    const isReceipt = contractAddress === receiptsContract.address;
    
    const resolvePrice = async () => {
      setRentPrice(await checkPrice(contractAddress, tokenId, isReceipt, client));
    }

    const resolveIsListed = async () => {
      setIsListed( await checkIsListed(isReceipt, contractAddress, tokenId, client));
    }
    
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
          account,
          client          
        ));
      if(isDisconnected)
          setIsRental(false);
    }

    resolvePrice();
    resolveIsListed();
    resolveIsRentedOut();
    resolveIsRental();

  }, [client, holder, account]);

  useEffect(() => {
    if(
      isListed !== undefined &&
      isRentedOut !== undefined &&
      isRental !== undefined
    ) setLoading(false);
  },[isListed, isRentedOut, isRental])

  // console.log('loading', loading);
  // console.log('isListed', isListed, 'isRentedOut', isRentedOut, 'isRental', isRental)
  
  return (
    <div className={classNames(styles.nftCardContainer, currentPage === 'market' ? styles.nftCardMarketContainer : '')}>
      <div className={styles.nftCardImageContainer} onClick={onClick}>
        <img width="100%" height="100%" src={imageURI} alt='NFT Image'/>
      </div>
      <div className={styles.nftCardInfo}>
        <span>{name}</span>
        {loading
         ? <span className={styles.notListed}>Loading...</span>
         : isListed
          ? (isRentedOut
              ? <span className={styles.rented}>
                  {/* {`Rent expires in ${expireDate || 'NaN'}`} */}
                  Rented
                </span>
              : <span className={styles.listed}>
                  Rent price:
                  <span className={styles.price}>
                    {rentPrice != undefined ? `${parseFloat(formatEther(convertUnitToSec(rentPrice, 'hour'))).toPrecision(2)} MATIC` : 'err'}
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