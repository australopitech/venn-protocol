import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useEthers, useSigner } from '@usedapp/core';
// import { DialogBorrowedDescription } from '../dialog-borrowed-description/dialog-borrowed-description';
// import { DialogExploreDescription } from '../dialog-explore-description/dialog-explore-description';
// import { DialogOwnedDescription } from '../dialog-owned-description/dialog-owned-description';
import styles from './nft-dialog.module.css';
import { DialogNotOwnedBorrowedDescription } from '../dialog-not-owned-borrowed-description/dialog-not-owned-borrowed-description';
import { DialogNotOwnedListedDescription } from '../dialog-not-owned-listed-description/dialog-not-owned-listed-description';
import { DialogOwnedListedDescription } from '../dialog-owned-listed-description/dialog-owned-listed-description';
import { DialogOwnedNotListedDescription } from '../dialog-owned-not-listed-description/dialog-owned-not-listed-description';
import { DialogOwnedRentedDescription } from '../dialog-owned-rented-description/dialog-owned-rented-description';
import { DialogNotOwnedNotListedDescription } from '../dialog-not-owned-not-listed-description/dialog-not-owned-not-listed-description';
// import classNames from 'classnames';
// import { getNFTobj, useNFTtitle, useNFTname, useTokenImage, useTokenMetaData } from '../../../hooks/nfts';
// import { Context } from 'wagmi';
import { NftItem } from '../../../types/types';
import walletFactory from '../../../utils/contractData/RWalletFactory.json';
import walletAbi from '../../../utils/contractData/RWallet.artifact.json';
import erc721 from '../../../utils/contractData/ERC721.artifact.json';
import mktPlace from '../../../utils/contractData/MarketPlace.json';
import receipts from '../../../utils/contractData/ReceiptNFT.json';
import { ethers, BigNumber } from 'ethers';
import { ownerOf } from '@/utils/utils';
// import dotenv from 'dotenv';
// dotenv.config();

// const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_GOERLI_PROVIDER)

function GetNftImage (nftItem: NftItem) {
  return nftItem.nftData.external_data.image_1024 ? 
         nftItem.nftData.external_data.image_1024 :
         nftItem.nftData.external_data.image;
}

async function isWallet(provider: any, address: string) {
  if(!provider) {
    console.log("error: no provider found");
    return
  }
  const fact = new ethers.Contract(walletFactory.address, walletFactory.abi, provider );
  const ret = await fact.isWallet(address);
  console.log('isWallet ret', ret);
  return ret
}

async function checkIsRental (provider: any, accountAddr: string | undefined, nftItem: NftItem | undefined) {
  if(!accountAddr || !nftItem) return
  if(!provider) {
    console.log("error: no provider found");
    return
  }
  if(await isWallet(provider, accountAddr)) {
    const wallet = new ethers.Contract(accountAddr, walletAbi.abi, provider);
    const ret = await wallet.isRental(nftItem.contractAddress, nftItem.nftData.token_id);
    console.log('isRental', ret);
    return ret
  }
  console.log('account is not a wallet');
  return false
}

async function getOwner(provider: any, nftItem: NftItem) {
  let ret;
  const nftContract = new ethers.Contract(nftItem.contractAddress, erc721.abi, provider);
  // console.log('nftContract', nftContract)
  return await nftContract.ownerOf(nftItem.nftData.token_id);
  console.log('getOwner ret', ret);
}

export async function getListData(
  provider: any, nftItem?: NftItem
) : Promise<{price: BigNumber | undefined, maxDur: BigNumber | undefined}> {
  if(!nftItem) return {price: undefined, maxDur: undefined};
  const contract = new ethers.Contract(mktPlace.address, mktPlace.abi, provider);
  const maxDur = await contract.getPrice(nftItem.contractAddress, nftItem.nftData.token_id);
  const price = await contract.getMaxDuration (nftItem.contractAddress, nftItem.nftData.token_id);
  return {price, maxDur};
}

const checkIsListedByReceipt = async(provider: any, receiptId: BigNumber) => {
  const mktPlaceContract = new ethers.Contract(mktPlace.address, mktPlace.abi, provider);
  const nftObj = await mktPlaceContract.getNFTbyReceipt(receiptId);
  console.log('nftByReceipt', nftObj);
  const maxDur = await mktPlaceContract.getMaxDuration(nftObj.contractAddress, nftObj.tokenId);
  console.log('maxDur', maxDur.toString(), maxDur.gt(0));
  return maxDur.gt(0);
}

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
    setIsNFTOpen?: any;
    nftItem?: NftItem;
}

// let image: string | undefined;
const propImage =  "https://dl.openseauserdata.com/cache/originImage/files/9d6b9f6ef3d8b0b0f08481be0a0fd2f8.png";


/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const NFTDialog = ({
    setIsNFTOpen,
    nftItem
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

    const {account, library} = useEthers();
    console.log('nft contract',nftItem?.contractAddress)
    console.log('nft id', nftItem?.nftData.token_id)
    console.log('nft_contract == receipts', nftItem?.contractAddress === receipts.address)
    console.log('receipts_contract', receipts.address )

    const isReceipt = useMemo(() => {
      if(!nftItem) return
      if(nftItem.contractAddress === receipts.address) return true;
      else return false;
    }, [])

    useEffect(() => {
      const fetchHolder = async () => {
        if(nftItem) setHolder(await getOwner(library, nftItem));
      }

      fetchHolder();

    }, []);

    /** - verifica se eh receipt
     *  - identifica o nft relacionado e verifica o holder
     *  - verifica se o holder é o market place
     *    - se sim, setIsRented_Out(false)
     *    - se nao, setIdRented_Out(true)
     */

    useEffect(() => { 
      const resolveIsRented_Out = async() => {
        if(holder == mktPlace.address) 
          setIsRented_Out(false);
        if(isReceipt && nftItem) {
          const mktPlaceContract = new ethers.Contract(mktPlace.address, mktPlace.abi, library);
          const nftObj = await mktPlaceContract.getNFTbyReceipt(BigNumber.from(nftItem.nftData.token_id));
          const nftHolder = await ownerOf(library, nftObj.contractAddress, nftObj.tokenId);
          if(nftHolder) {
            if(nftHolder === mktPlace.address) setIsRented_Out(false);
            else setIsRented_Out(true);
          };
        }
      }

      resolveIsRented_Out();
    }, [holder])

    useEffect(() => {
      const resolveIsListed = async () => {
        if(isReceipt) {
          setIsListed(
            await checkIsListedByReceipt(library, BigNumber.from(nftItem?.nftData.token_id))
          );
          return
        }
        if(holder == mktPlace.address) { 
          const { maxDur } : { maxDur: BigNumber | undefined } = await getListData(library, nftItem);
          if(maxDur) setIsListed(true);
          if(maxDur?.eq(0)) setIsListed(false);
          return;
        }
        if(holder) setIsListed(false);
      }

      resolveIsListed();

    }, [holder]);

    useEffect(() => {
      const resolveIsRental = async () => {
        if(holder && account){
          if(holder == account) {
            setIsRental_signer(await checkIsRental(library, account, nftItem));
            return
          }
          setIsRental_signer(false);
        }
      }

      resolveIsRental();

    }, [holder]);

    useEffect(() => {
      if(holder && isRental_signer !== undefined) {
        if(holder === account) setIsOwned(!isRental_signer);
        else setIsOwned(false);
      }
    },[holder, isRental_signer])


    console.log('holder', holder)
    console.log('isListed', isListed)
    console.log('isOwned', isOwned)
    console.log('isRental_signer', isRental_signer)
    console.log('isReceipt', isReceipt)
    console.log('signer', account)

    const name = nftItem ? nftItem.nftData.external_data.name : "Awesome NFT #1"
    const description = nftItem ? nftItem.nftData.external_data.description : "This is an awesome NFT uhul This is an awesome NFT uhul This is an awesome NFT uhul This is an awesome NFT uhul This is an awesome NFT uhul This is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhulThis is an awesome NFT uhul."
    // const description = "Bla blabla blablabla."

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
                <h1 className={styles.title} title={name}>{name}</h1>
                <p className={styles.nftDescription}>
                  {description}
                </p>
                {!isOwned && isRental_signer &&
                  <DialogNotOwnedBorrowedDescription />} {/* rented by signer */}
                {!isOwned && isListed && !isRented_Out &&
                  <DialogNotOwnedListedDescription />}   {/* available for rent */}
                {/* {!isOwned && isListed && !isRented_Out &&
                 <DialogNotOwnedRentedDescription />} */}
                {!isOwned && !isListed && 
                  <DialogNotOwnedNotListedDescription />} {/* not available for rent*/}
                {isOwned && isListed && isReceipt && !isRented_Out && 
                  <DialogOwnedListedDescription />} {/* owned/listed by signer/not rented out */}
                {isOwned && !isListed && !isReceipt && 
                  <DialogOwnedNotListedDescription nftItem={nftItem} />} {/* owned/not listed by signer/not rented out */}
                {isOwned && isReceipt && isRented_Out &&
                  <DialogOwnedRentedDescription />} {/* owned / rented out */}
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
