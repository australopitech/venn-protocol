import Image from 'next/image';
import styles from './nft-card.module.css';
import classNames from 'classnames';
import { ethers } from 'ethers';
import { useMemo, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useEthers } from '@usedapp/core';
import { ownerOf, resolveIsListed, resolveIsRentedOut, getListData, getNFTByReceipt, checkIsRental } from '@/utils/utils';
import receiptsContract from '../../../utils/contractData/ReceiptNFT.json';

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
  onClick
}: NftCardProps) {
  
  const { library, account } = useEthers();
  const [holder, setHolder] = useState<string>();
  const [isListed, setIsListed] = useState<string>();
  const [rentPrice , setRentPrice] = useState<string>();
  const [isRentedOut, setIsRentedOut] = useState<boolean>();
  const [isRental, setIsRental] = useState<boolean>();
  
  // console.log('library', library);
  // console.log('rentPrice', rentPrice)
  console.log('tokenid/isrental',tokenId.toString(),isRental)
  
  const isReceipt = useMemo(() => {
    // if(!nftItem) return
    if(contractAddress === receiptsContract.address) return true;
    else return false;
  }, []);

  console.log('isReceipt', isReceipt);
  console.log('contractAddress', contractAddress)
  useEffect(() => {
    const fetchHolder = async () => {
      setHolder(await ownerOf(library, contractAddress, tokenId));
    }

    fetchHolder();

  }, [library]);

  useEffect(() => {
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
  }, [library, account]);

  useEffect(() => {
    resolveIsListed(library, setIsListed, isReceipt, contractAddress, tokenId, holder);
  }, [library, holder, isReceipt]);

  useEffect(() => {
    const resolvePrice = async() => {
      let _contractAddr;
      let _tokenId;
      if(isReceipt){
        const nftObj = await getNFTByReceipt(library, tokenId);
        contractAddress = nftObj?.contractAddress;
        tokenId = nftObj?.tokenId;  
      } else{
        _contractAddr = contractAddress;
        _tokenId = tokenId;
      }
      const { price } = await getListData(
        library, 
        contractAddress,
        tokenId
      );
      if(price) setRentPrice(ethers.utils.formatEther(price));
    }

    resolvePrice();

  }, [library]);

  useEffect(() => {
    resolveIsRentedOut(library, setIsRentedOut, isReceipt, tokenId, holder );
  }, [library, isReceipt, holder]);

  
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
          : <span className={styles.notListed}>
              Not listed
            </span>
        }
      </div> 
    </div>
  );
}