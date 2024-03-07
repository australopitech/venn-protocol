'use client'
import NftCard from '@/components/common/nft-card/nft-card';
import styles from './nft-area.module.css';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FetchNftDataResponse } from '@/types';
import { nftViewMode } from '@/types/nftContext';
import { getAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useSmartAccount } from '@/app/account/venn-provider';
import { compactString, copyAddress } from '@/utils/utils';
import Tooltip from '@/components/common/tooltip/tooltip';
import { LoadingPage } from '../dashboard-layout/dashboard-layout';

export interface NftAreaProps {
  nftAreaGridTemplate?: string;
  setIsNFTOpen: any;
  setSelectedNFT: any;
  // trigger: boolean;
  nftFetchData?: FetchNftDataResponse;
  address?: string;
  viewMode?: nftViewMode;
}

interface ToggleSwitchProps {
  onToggle: (state: boolean) => void;
}

const ToggleSwitch = ({ onToggle }: ToggleSwitchProps) => {
  // const [isChecked, setIsChecked] = useState(false);
  const [isAllNfts, setIsAllNfts] = useState<boolean>(true);

  const handleToggle = () => {
    setIsAllNfts(!isAllNfts);
    if (onToggle) {
      onToggle(!isAllNfts);
    }
  };

  return (
    // <div className={styles.toggleGridType}>
    //   toggle here
    // </div>

    // <div 
    //   onClick={handleToggle}
    //   style={{
    //     cursor: 'pointer',
    //     padding: '5px 15px',
    //     borderRadius: '15px',
    //     backgroundColor: isAllNfts ? 'green' : 'grey',
    //     color: 'white',
    //     display: 'inline-flex',
    //     alignItems: 'center',
    //     justifyContent: 'center'
    //   }}>
    //   {isAllNfts ? 'ON' : 'OFF'}
    // </div>

    <div 
      onClick={handleToggle}
      className={styles.toggleSwitchContainer}>
      <div 
        className={classNames(styles.switchBackground, isAllNfts ? styles.allNfts : '')} 
      />
      <div 
        className={classNames(styles.labelLeft, styles.labelOn, isAllNfts ? styles.allNfts : '')}>
        {/* All NFTs */}
        All
      </div>
      <div 
        className={classNames(styles.labelRight, styles.labelOff, isAllNfts ? styles.allNfts : '')}>
        {/* Collections */}
        Listed
      </div>
    </div>
  )
}

const tooltipDefaultText = "Click to copy";
const tootipAltText = "Copied!"

export default function NftArea ({ nftAreaGridTemplate, setIsNFTOpen, nftFetchData, setSelectedNFT, address, viewMode}: NftAreaProps) {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [toggleState, setToggleState] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState(tooltipDefaultText);
  const { address: eoa, isConnecting } = useAccount();
  const { address: vsa } = useSmartAccount();

  console.log('isLoadingData', isLoadingData)
  useEffect(() => {
    console.log('render')
    if(!isConnecting && !nftFetchData?.isLoading && !nftFetchData?.isFetching)
      setTimeout(() => {
        setIsLoadingData(false);
      }, 2000);
    else
      setIsLoadingData(true)
  }, [isConnecting, nftFetchData])

  const handleToggle = (state: boolean) => {
    setToggleState(state);
    console.log('Toggle state:', state);
  };

  const handleOnCardClick = (i: any) => {
    setSelectedNFT(i);
    setIsNFTOpen(true);
  }

  const handleAddressClick = async () => {
    await copyAddress(address);
    setTooltipText(tootipAltText);
    setTimeout(() => {
      setTooltipText(tooltipDefaultText);
    }, 5000)
  }

  return (
    <div className={styles.nftArea}>
      <div className={styles.nftGridTitle}>
        <span className={styles.titleText}>
          Owned/Rented by {(address === vsa || address === eoa || !address && (vsa || eoa)) 
          ? 'You' 
          : <span className={styles.address} onClick={() => handleAddressClick()}>
            <Tooltip text={tooltipText}>{compactString(address)}</Tooltip>
            </span>}
        </span>
        <div className={styles.gridFunctionalitiesContainer}>
          <Tooltip text='Filters comming soon'><ToggleSwitch onToggle={handleToggle} /></Tooltip>
        </div>
      </div>
      <div className={styles.invisibleDivider}></div>
      <div className={styles.nftGridContent}>
        <div className={styles.cardGrid}>
          {isLoadingData
            ? <LoadingPage />
            : nftFetchData?.error 
              ? "Error: " + nftFetchData?.error
              : nftFetchData?.data?.nfts 
                ? nftFetchData?.data.nfts.length == 0 
                 ? "No nfts" 
                 : nftFetchData.data.nfts
                    //  .filter(nft => nft.isRental === (viewMode === 'rented'))
                    .map((nft, i) =>
                    <NftCard
                      imageURI={
                        nft.imageCached ?? nft.image ?? "" // TODO substitute for no image symbol
                      }
                      name={nft.name ?? ""}
                      contractAddress={getAddress(nft.contractAddress)}
                      tokenId={nft.tokenId ? BigInt(nft.tokenId) : undefined}
                      // price={0}
                      // isRented={false}
                      address={address}
                      // expireDate={'0'}
                      key={nft.contractAddress + nft.tokenId}
                      onClick={() => {handleOnCardClick(i)} }
                      holderAddress={nft.owner}
                    />) : "Something went wrong"
          }

        </div>
        {/* <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div> */}
        {/** BEGIN ghost cards to maintain grid proportions: width is the same as NftCard component */}
        {/** IMPORTANT: do not remove the next 3 rows! */}
        {/* <div className={styles.ghostCard} />
        <div className={styles.ghostCard} /> 
        <div className={styles.ghostCard} /> */}
        {/** END */}
      </div>
    </div>
    // </div>
  );
}
