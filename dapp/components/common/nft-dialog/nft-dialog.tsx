'use client'
import React, { useEffect, useState } from 'react';
import styles from './nft-dialog.module.css';
import { DialogNotOwnedBorrowedDescription } from '../dialog-not-owned-borrowed-description/dialog-not-owned-borrowed-description';
import { DialogNotOwnedListedDescription } from '../dialog-not-owned-listed-description/dialog-not-owned-listed-description';
import { DialogOwnedListedDescription } from '../dialog-owned-listed-description/dialog-owned-listed-description';
import { DialogOwnedNotListedDescription } from '../dialog-owned-not-listed-description/dialog-owned-not-listed-description';
import { DialogOwnedRentedDescription } from '../dialog-owned-rented-description/dialog-owned-rented-description';
import { DialogNotOwnedNotListedDescription } from '../dialog-not-owned-not-listed-description/dialog-not-owned-not-listed-description';
import { NftItem, ApproveData, VennNftItem } from '@/types';
import { getReceiptsContractAddress } from '@/utils/contractData';
import { ownerOf, checkIsRentedOut, checkIsRental, checkIsListed } from '@/utils/listing-data';
import { useAccount, usePublicClient } from 'wagmi';
import { getAddress } from 'viem';
import { useSmartAccount } from '@/app/account/venn-provider';

function GetNftImage (nftItem: VennNftItem) {
  return nftItem.imageCached ? nftItem.imageCached : nftItem.image;
}

// async function getOwner(provider: any, nftItem: NftItem) {
//   const nftContract = new ethers.Contract(nftItem.contractAddress, erc721.abi, provider);
//   // console.log('nftContract', nftContract)
//   return await nftContract.ownerOf(nftItem.nftData.token_id);
// }


const CloseButton = () => {
  return (
    <svg
      fill="none"
      height="27"
      overflow="visible"
      viewBox="0 0 27 27"
      width="27"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
            d="M13.5064 27C20.9094 27 27 20.9094 27 13.5064C27 6.09061 20.9094 0 13.4936 0C6.07787 0 0 6.09061 0 13.5064C0 20.9094 6.09061 27 13.5064 27ZM9.41623 19.0618C8.57527 19.0618 7.92544 18.412 7.92544 17.5583C7.92544 17.176 8.09108 16.8065 8.3714 16.5262L11.3785 13.5191L8.3714 10.512C8.09108 10.2317 7.92544 9.84946 7.92544 9.47994C7.92544 8.62624 8.57527 7.9764 9.41623 7.9764C9.87494 7.9764 10.219 8.11656 10.512 8.42237L13.4936 11.3912L16.5007 8.40963C16.8065 8.10382 17.1505 7.96366 17.5965 7.96366C18.4375 7.96366 19.0873 8.6135 19.0873 9.4672C19.0873 9.84946 18.9344 10.2062 18.6413 10.4993L15.647 13.5191L18.6286 16.5135C18.9217 16.8065 19.0873 17.176 19.0873 17.5583C19.0873 18.412 18.4247 19.0618 17.5838 19.0618C17.1378 19.0618 16.7683 18.9217 16.4752 18.6286L13.4936 15.6597L10.5375 18.6286C10.2317 18.9217 9.87494 19.0618 9.41623 19.0618Z"
            fill="white"
        >
        </path>
      </g>
    </svg>
  )
}

export interface NFTDialogProps {
    setIsNFTOpen: any;
    setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>;
    setTxResolved: any;
    setError: any;
    txLoading: boolean;
    txResolved?: any;
    nftItem?: VennNftItem;
    address?: `0x${string}`;
}

// let image: string | undefined;
const propImage =  "https://dl.openseauserdata.com/cache/originImage/files/9d6b9f6ef3d8b0b0f08481be0a0fd2f8.png";


/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const NFTDialog = ({
    setIsNFTOpen,
    setApproveData,
    setTxResolved,
    setError,
    txLoading,
    txResolved,
    nftItem,
    address
}: NFTDialogProps) => {
    const image = nftItem ? GetNftImage(nftItem) : propImage;

    const onCloseDialog = () => {
        setIsNFTOpen(false);
    };

    const stopPropagation = (e: any) => {
        e.stopPropagation();
    };
    
    const [holder, setHolder] = useState<string>();
    const [isListed, setIsListed] = useState<boolean>();
    const [isOwned, setIsOwned] = useState<boolean>();
    const [isRental_signer, setIsRental_signer] = useState<boolean>();
    const [isRented_Out, setIsRented_Out] = useState<boolean>()
    // 
    const [isReceipt, setIsReceipt] = useState<boolean>();
    const [loading, setLoading] = useState<boolean>(true);
    const [tokenId, setTokenId] = useState<bigint>();
    const client = usePublicClient();
    const { address: eoa } = useAccount();
    const { address: vsa } = useSmartAccount();

    // console.log('nft id', nftItem?.nftData.token_id)

    useEffect(() => {
      if(nftItem){
        setIsReceipt(getAddress(nftItem.contractAddress ?? "") === getReceiptsContractAddress());
        if(nftItem.tokenId) {
          setTokenId(BigInt(nftItem.tokenId));
        } else console.error('no token id found');
      } 
    }, [nftItem]);

    useEffect(() => {
      const fetchHolder = async () => {
        if(nftItem && tokenId !== undefined)
          setHolder(await ownerOf(client, nftItem.contractAddress, tokenId,));
      }
      fetchHolder();

    }, [nftItem, tokenId]);


    useEffect(() => {
      if(!nftItem || tokenId === undefined || isReceipt === undefined) 
        return
      console.log('enter useefect')
      const resolveIsRentedOut = async () => {
        const res = await checkIsRentedOut(
          nftItem.contractAddress,
          tokenId,
          isReceipt,
          holder,
          client
        );
        // console.log('checkIsRentedOut response', res);
        setIsRented_Out(res)
      }
      
      const resolveIsListed = async () => {
        const res = await checkIsListed(
        isReceipt,
        nftItem.contractAddress,
        tokenId,
        client
        );
        // console.log('checkIsListed Response', res);
        setIsListed(res)
      }

      const resolveIsRental = async () => {
        const res = await checkIsRental(
          isReceipt,
          nftItem.contractAddress,
          tokenId,
          vsa?? eoa,
          client
        );
        // console.log('checkIsRental response', res)
        setIsRental_signer(res)
      }

      resolveIsRentedOut();
      resolveIsListed()
      resolveIsRental();

    }, [client, holder, isReceipt, eoa, vsa])


    useEffect(() => {
      if(holder && isRental_signer !== undefined) {
        if(holder === vsa) setIsOwned(!isRental_signer)
        else if(holder === eoa) setIsOwned(!isRental_signer);
        else setIsOwned(false);
      }
    },[holder, isRental_signer]);

    useEffect(() => {
      if(
        isOwned !== undefined &&
        isListed !== undefined &&
        isReceipt !== undefined &&
        isRental_signer !== undefined &&
        isRented_Out !== undefined
      ) setLoading(false );
    },[isOwned, isListed, isReceipt, isRental_signer, isRented_Out])


    console.log('holder', holder)
    console.log('isListed', isListed)
    console.log('isOwned', isOwned)
    console.log('isRental_signer', isRental_signer)
    console.log('eoa', eoa)
    console.log('isReceipt', isReceipt)
    console.log('isRented_Out', isRented_Out)
    console.log('loading', loading)

    const name = nftItem ? nftItem.name : "Awesome NFT #1"
    const description = nftItem ? nftItem.description : "This is an awesome NFT uhul This is an awesome NFT uhul This is an awesome NFT uhul This is an awesome NFT uhul This is an awesome NFT uhul This is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhul."

    return (
        <div className={styles.nftDialogBackdrop} onClick={onCloseDialog}>
          <dialog className={styles.nftDialog} open>
            <div className={styles.nftDialogContent}>
              <div className={styles.nftImageContainer} onClick={stopPropagation}>
                <div className={styles.nftImagePreview}>
                  <img
                    src={image? image : propImage}
                    className={styles.image}
                  />
                </div>
              </div>
              <div className={styles.nftDescriptionContainer} onClick={stopPropagation}>
                <h1 className={styles.title} title={name ?? ""}>{name}</h1>
                <p className={styles.nftDescription}>
                  {description}
                </p>
                {loading && <h1>Loading...</h1>}
                {!loading && !isOwned && isRental_signer &&
                  <DialogNotOwnedBorrowedDescription isRental={isRental_signer} contractAddress={nftItem?.contractAddress} tokenId={tokenId} />}
                   {/* rented by signer */}
                
                {!loading && !isOwned && isListed && !isRented_Out && !isRental_signer &&
                  <DialogNotOwnedListedDescription 
                  contractAddress={nftItem?.contractAddress} tokenId={tokenId} setIsNFTOpen={setIsNFTOpen} isReceipt={isReceipt} 
                  setApproveData={setApproveData} txLoading={txLoading} setError={setError}
                   />}   {/* available for rent */}
                
                {!loading && !isOwned && isRented_Out && !isRental_signer &&
                 <DialogNotOwnedBorrowedDescription address={address} contractAddress={nftItem?.contractAddress} tokenId={tokenId} />}
                
                {!loading && !isOwned && !isListed && !isRented_Out && 
                  <DialogNotOwnedNotListedDescription />} {/* not available for rent*/}
                
                {!loading && isOwned && isListed && isReceipt && !isRented_Out && 
                  <DialogOwnedListedDescription 
                  contractAddress={nftItem?.contractAddress} tokenId={tokenId} setError={setError}
                  setIsNFTOpen={setIsNFTOpen} setTxResolved={setTxResolved} setApproveData={setApproveData}/>} 
                  {/* owned/listed by signer/not rented out */}
                
                {!loading && isOwned && !isListed && !isReceipt && 
                  <DialogOwnedNotListedDescription 
                  contractAddress={nftItem?.contractAddress} tokenId={tokenId}
                  owner={nftItem?.owner} setIsNFTOpen={setIsNFTOpen} setError={setError} 
                  setApproveData={setApproveData} setTxResolved={setTxResolved}
                  /> } 
                  {/* owned/not listed by signer/not rented out */}
                
                {!loading && isOwned && isReceipt && isRented_Out &&
                  <DialogOwnedRentedDescription 
                    isListed={isListed} contractAddress={nftItem?.contractAddress} tokenId={tokenId}
                    setIsNFTOpen={setIsNFTOpen} setApproveData={setApproveData} setTxResolved={txResolved}
                  />} {/* owned / rented out */}
                {/* {!isOwned && isReceipt && 
                  <DialogOwnedRentedDescription />} receipt held by 3rd party; NFT available */}
              </div>
            </div>
          </dialog>
          <div onClick={() => onCloseDialog()} className={styles.closeButton}>
            <div>
              <CloseButton />
            </div>
          </div>
        </div>
    );
};
