import NftCard from '@/components/common/nft-card/nft-card';
import styles from './nft-area.module.css';
import classNames from 'classnames';
import { useState } from 'react';
import { ethers } from 'ethers';
import { NftItem, FetchNftDataResponse } from '../../../types/typesNftApi';
import { fetchAddressData } from '@/utils/frontendUtils';
import { BigNumber } from 'ethers';
import { nftViewMode } from '@/types/nftContext';

export interface NftAreaProps {
  nftAreaGridTemplate?: string;
  setIsNFTOpen: any;
  setSelectedNFT: any;
  nftFetchData?: FetchNftDataResponse;
  address?: string;
  viewMode: nftViewMode;
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

export default function NftArea ({ nftAreaGridTemplate, setIsNFTOpen, nftFetchData, setSelectedNFT, address, viewMode}: NftAreaProps) {
  const [toggleState, setToggleState] = useState<boolean>(false);

  const handleToggle = (state: boolean) => {
    setToggleState(state);
    console.log('Toggle state:', state);
  };

  const handleOnCardClick = (i: any) => {
    setSelectedNFT(i);
    setIsNFTOpen(true);
  }

  return (
    <div className={styles.nftArea}>
      <div className={styles.nftGridTitle}>
        <span className={styles.titleText}>Owned</span>
        <div className={styles.gridFunctionalitiesContainer}>
          <ToggleSwitch onToggle={handleToggle} />
        </div>
      </div>
      <div className={styles.invisibleDivider}></div>
      <div className={styles.nftGridContent}>
        <div className={styles.cardGrid}>
          {nftFetchData?.nfts ? 
           nftFetchData?.nfts.length == 0 ?
           "No nfts" :
           nftFetchData.nfts
             .filter(nft => nft.isRental === (viewMode === 'rented'))
             .map((nft, i) =>
            <NftCard
              imageURI={
                nft.nftData?.external_data?.image_1024 ?
                nft.nftData?.external_data?.image_1024 :
                nft.nftData?.external_data?.image
              }
              name={nft.nftData?.external_data?.name}
              contractAddress={ethers.utils.getAddress(nft.contractAddress)}
              tokenId={BigNumber.from(nft.nftData.token_id)}
              // price={0}
              // isRented={false}
              address={address}
              expireDate={'0'}
              key={nft.contractAddress + nft.nftData?.token_id}
              onClick={() => {handleOnCardClick(i)} }
              holderAddress={nft.owner}
            />) :
            nftFetchData?.isLoading ? "Loading..." : "Error" + nftFetchData?.error
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
