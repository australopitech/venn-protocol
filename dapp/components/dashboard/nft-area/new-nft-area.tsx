'use client'
import styles from './new-nft-area.module.css';
import NftCard from '@/components/common/nft-card/nft-card';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FetchNftDataResponse } from '@/types';
import { nftViewMode } from '@/types/nftContext';
import { getAddress } from 'viem';
import { useAccount } from 'wagmi';
import { useSmartAccount } from '@/app/account/venn-provider';
import { compactString, copyAddress } from '@/utils/utils';
import { Tooltip } from '@/components/common/tooltip/tooltip';
import { LoadingDots, LoadingPage } from '../dashboard-layout/dashboard-layout';
import { mintMockNFT } from '@/utils/demo';
import { useRefetchAddressData } from '@/hooks/address-data';
import Link from 'next/link';
import { LoadingContent, LoadingNftCard } from '@/components/common/loading/loading';

export interface NftAreaProps {
  setIsNFTOpen: any;
  setSelectedNFT: any;
  // trigger: boolean;
  nftFetchData?: FetchNftDataResponse;
  address?: string;
  viewMode?: nftViewMode;
}

export default function NftArea ({ 
  setIsNFTOpen, nftFetchData, setSelectedNFT, address, viewMode
} : NftAreaProps
) {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [toggleState, setToggleState] = useState<boolean>(false);
  // const [tooltipText, setTooltipText] = useState(tooltipDefaultText);
  const { address: eoa, isConnecting } = useAccount();
  const { address: vsa } = useSmartAccount();

  useEffect(() => {
    console.log('render')
    if(!isConnecting && !nftFetchData?.isLoading && !nftFetchData?.isFetching)
      setTimeout(() => {
        setIsLoadingData(false);
      }, 2000);
    else
      setIsLoadingData(true)
  }, [isConnecting, nftFetchData]);

  const handleOnCardClick = (i: any) => {
    setSelectedNFT(i);
    setIsNFTOpen(true);
  }



    return (
        <div className={styles.nftArea}>
            <div className={styles.nftAreaHeader}>
                {/* <div className={styles.nftQuantity}>12 NFTs</div> */}
                {isLoadingData
                 ? <div style={{ width: '100px', height: 'var(--step-2)'}}><LoadingContent/></div>
                 : <div className={styles.nftQuantity}>{nftFetchData?.data?.nfts?.length} NFTs</div>
                }
                <ToggleSwitch onToggle={() => {}}/>
            </div>
            {isLoadingData
             ? <LoadingGrid/>
             : nftFetchData?.error
              ? "Error" + nftFetchData.error
              : nftFetchData?.data?.nfts?.length === 0
               ? "No NFTs"
               : <div className={styles.nftGrid}>
                  {nftFetchData?.data?.nfts?.map((nft, i) =>
                    <NftCard
                    imageURI={nft.imageCached ?? nft.image ?? ""} // TODO substitute for no image symbol
                    name={nft.name ?? ""}
                    contractAddress={getAddress(nft.contractAddress)}
                    tokenId={nft.tokenId !== null ? BigInt(nft.tokenId) : undefined}
                    address={address}
                    key={nft.contractAddress + nft.tokenId}
                    onClick={() => handleOnCardClick(i)}
                    holderAddress={nft.owner}
                    />
                  )}
               </div>
            }
            {/* <div className={styles.nftGrid}>
                <div className={styles.mockNftCard}>
                    <div className={styles.mockNftImage}></div>
                    <span className={styles.status}>Listed</span>
                </div>
                <div className={styles.mockNftCard}>
                    <div className={styles.mockNftImage}></div>
                    <span className={styles.status}>Listed</span>
                </div>
                <div className={styles.mockNftCard}>
                    <div className={styles.mockNftImage}></div>
                    <span className={styles.status}>Listed</span>
                </div>
                <div className={styles.mockNftCard}>
                    <div className={styles.mockNftImage}></div>
                    <span className={styles.status}>Listed</span>
                </div>
                <div className={styles.mockNftCard}>
                    <div className={styles.mockNftImage}></div>
                    <span className={classNames(styles.status, styles.notListed)}>Not Listed</span>
                </div>
                <div className={styles.mockNftCard}>
                    <div className={styles.mockNftImage}></div>
                    <span className={classNames(styles.status, styles.notListed)}>Not Listed</span>
                </div>
                <div className={styles.mockNftCard}>
                    <div className={styles.mockNftImage}></div>
                    <span className={classNames(styles.status, styles.notListed)}>Not Listed</span>
                </div>
                <div className={styles.mockNftCard}>
                    <div className={styles.mockNftImage}></div>
                    <span className={classNames(styles.status, styles.notListed)}>Not Listed</span>
                </div>
                <div className={styles.mockNftCard}>
                    <div className={styles.mockNftImage}></div>
                    <span className={classNames(styles.status, styles.notListed)}>Not Listed</span>
                </div>
                <div className={styles.mockNftCard}>
                    <div className={styles.mockNftImage}></div>
                    <span className={classNames(styles.status, styles.notListed)}>Not Listed</span>
                </div>
            </div> */}
        </div>
    )
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
      <div 
        onClick={handleToggle}
        className={styles.toggleSwitchContainer}>
        <div 
          className={classNames(styles.switchBackground, isAllNfts ? styles.allNfts : '')} 
        />
        <div 
          className={classNames(styles.labelLeft, styles.labelOn, isAllNfts ? styles.allNfts : '')}>
          {/* All NFTs */}
          {`   `}
        </div>
        <div 
          className={classNames(styles.labelRight, styles.labelOff, isAllNfts ? styles.allNfts : '')}>
          {/* Collections */}
          {`   `}
        </div>
      </div>
    )
}

const LoadingGrid = () => {
  return (
    <div className={styles.nftGrid}>
      <div className={styles.loadingNftCard}><LoadingContent/></div>
      <div className={styles.loadingNftCard}><LoadingContent/></div>
      <div className={styles.loadingNftCard}><LoadingContent/></div>
      <div className={styles.loadingNftCard}><LoadingContent/></div>
      <div className={styles.loadingNftCard}><LoadingContent/></div>
      <div className={styles.loadingNftCard}><LoadingContent/></div>
    </div>
  )
}

