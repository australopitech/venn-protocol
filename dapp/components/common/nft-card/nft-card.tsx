import Image from 'next/image';
import styles from './nft-card.module.css';
import classNames from 'classnames';
import { ethers } from 'ethers';
import { useMemo, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useEthers } from '@usedapp/core';
import { 
  ownerOf, resolveIsListed, resolveIsRentedOut, getListData, getNFTByReceipt, checkIsRental, resolvePrice
 } from '@/utils/utils';
import { receiptsContract } from '@/utils/contractData';

export interface NftCardProps {
  imageURI: string;
  name: string;
  contractAddress: string;
  tokenId: BigNumber;
  price?: number; 
  // isRented?: boolean;
  expireDate?: string;
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
  // isRented, 
  expireDate,
  address, 
  currentPage,
  onClick,
  holderAddress
}: NftCardProps) {
  
  const { library, account } = useEthers();
  const [holder, setHolder] = useState<string>();
  const [isListed, setIsListed] = useState<string>();
  const [rentPrice , setRentPrice] = useState<string>();
  const [isRentedOut, setIsRentedOut] = useState<boolean>();
  const [isRental, setIsRental] = useState<boolean>();
  
  console.log('tokenid/isrental',tokenId.toString(),isRental)
  
  useEffect(() => {
    const isReceipt = contractAddress === receiptsContract.address;
    const fetchHolder = async () => {
      if (holderAddress) {
        setHolder(holderAddress);
      }
      else {
        setHolder(await ownerOf(library, contractAddress, tokenId));
      }
    }

    fetchHolder();
    resolvePrice(setRentPrice, contractAddress, tokenId, isReceipt, library);
    resolveIsListed(setIsListed, isReceipt, contractAddress, tokenId, library);
    resolveIsRentedOut(setIsRentedOut, contractAddress, tokenId, isReceipt, holder, library);

    const resolveIsRental = async() => {
      if(address) {
        setIsRental(await checkIsRental(
          library,
          address,
          contractAddress,
          tokenId
        ));
        return
      }
      if(account)
        setIsRental( await checkIsRental(
          library,
          account,
          contractAddress,
          tokenId  
        ));
    }

    resolveIsRental();
  }, [library, holder, account]);

  console.log('contractAddress', contractAddress)
  return (
    <div className={classNames(styles.nftCardContainer, currentPage === 'market' ? styles.nftCardMarketContainer : '')}>
      <div className={styles.nftCardImageContainer} onClick={onClick}>
        <img width="100%" height="100%" src={imageURI} alt='NFT Image'/>
      </div>
      <div className={styles.nftCardInfo}>
        <span>{name}</span>
        {isListed
          ? (isRentedOut
              ? <span className={styles.rented}>
                  {/* {`Rent expires in ${expireDate || 'NaN'}`} */}
                  Rented
                </span>
              : <span className={styles.listed}>
                  Rent price:
                  <span className={styles.price}>
                    {`${rentPrice} ETH`}
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
      </div> 
    </div>
  );
}