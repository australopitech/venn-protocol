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
import { LoadingDots, LoadingPage } from '../dashboard-layout/dashboard-layout';
import { mintMockNFT } from '@/utils/demo';
import { useRefetchAddressData } from '@/hooks/address-data';
import Link from 'next/link';

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

const MintIcon = () => {
  return (
    <svg className={styles.heroIcon} fill="#FFF" width="24px" height="24px" viewBox="0 0 7 7" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.719 6.388c-0.025 -0.122 -0.251 -0.396 -0.328 -0.396 -0.083 0 -0.052 -0.05 0.067 -0.108a0.505 0.505 0 0 0 0.202 -0.229l0.089 -0.173 0.087 0.173a0.5 0.5 0 0 0 0.202 0.229c0.117 0.058 0.15 0.108 0.07 0.108 -0.076 0 -0.266 0.221 -0.317 0.369l-0.05 0.139 -0.022 -0.112zm-2.185 -0.327c-0.038 -0.191 -0.227 -0.421 -0.417 -0.509l-0.175 -0.081 0.114 -0.025c0.166 -0.036 0.411 -0.297 0.463 -0.491 0.024 -0.088 0.052 -0.16 0.064 -0.16 0.011 0 0.04 0.072 0.063 0.16 0.052 0.195 0.297 0.455 0.464 0.491l0.114 0.025 -0.177 0.082c-0.2 0.092 -0.378 0.306 -0.413 0.496 -0.028 0.148 -0.069 0.153 -0.098 0.012zm2.304 -1.589a0.318 0.318 0 0 0 -0.128 -0.142l-0.082 -0.037 0.121 -0.115c0.067 -0.063 0.121 -0.143 0.121 -0.18 0 -0.05 0.017 -0.038 0.068 0.044a0.68 0.68 0 0 0 0.148 0.167l0.082 0.057 -0.082 0.057a0.64 0.64 0 0 0 -0.141 0.155l-0.06 0.099 -0.047 -0.105zm1.679 -0.367a0.801 0.801 0 0 1 -0.045 -0.155 1.52 1.52 0 0 0 -0.321 -0.599c-0.129 -0.142 -0.431 -0.316 -0.558 -0.32 -0.04 0 -0.006 -0.023 0.075 -0.049a1.105 1.105 0 0 0 0.506 -0.327c0.13 -0.148 0.315 -0.52 0.315 -0.633 0 -0.139 0.061 -0.118 0.085 0.028 0.03 0.188 0.169 0.458 0.324 0.63 0.129 0.142 0.431 0.316 0.558 0.32 0.04 0 0.006 0.022 -0.075 0.048 -0.395 0.123 -0.682 0.449 -0.798 0.905 -0.025 0.101 -0.055 0.168 -0.066 0.15zM2.59 3.433c-0.035 -0.22 -0.222 -0.468 -0.434 -0.579 -0.178 -0.092 -0.18 -0.095 -0.082 -0.114 0.209 -0.042 0.52 -0.437 0.53 -0.674 0.002 -0.039 0.036 0.024 0.076 0.138 0.086 0.248 0.31 0.492 0.489 0.533l0.119 0.027 -0.123 0.05c-0.235 0.096 -0.421 0.324 -0.511 0.624l-0.041 0.139 -0.023 -0.143zM1.393 2.55c-0.026 -0.167 -0.165 -0.445 -0.305 -0.615a1.2 1.2 0 0 0 -0.362 -0.255c-0.14 -0.068 -0.225 -0.123 -0.191 -0.123 0.116 0 0.399 -0.17 0.532 -0.319 0.146 -0.163 0.338 -0.535 0.338 -0.659 0 -0.127 0.059 -0.091 0.082 0.05 0.058 0.353 0.429 0.803 0.741 0.895l0.158 0.046 -0.244 0.118a0.983 0.983 0 0 0 -0.382 0.292c-0.128 0.162 -0.283 0.499 -0.283 0.614 0 0.112 -0.064 0.078 -0.083 -0.044zm2.62 -0.655c-0.003 -0.107 -0.137 -0.295 -0.245 -0.344l-0.1 -0.044 0.11 -0.072a0.683 0.683 0 0 0 0.184 -0.219l0.074 -0.146 0.074 0.153a0.493 0.493 0 0 0 0.183 0.21l0.109 0.056 -0.117 0.077a0.701 0.701 0 0 0 -0.195 0.236c-0.045 0.093 -0.079 0.131 -0.079 0.092z"/>
    </svg>
  )
}

const StoreIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-building-store" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21l18 0" /><path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" /><path d="M5 21l0 -10.15" /><path d="M19 21l0 -10.15" /><path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" /></svg>
  )
}

const ErrorIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-xbox-x" width="40" height="40" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z" /><path d="M9 8l6 8" /><path d="M15 8l-6 8" /></svg>
  )
}

const NoNFTs = ({ address, isSigner } : { address: string, isSigner: boolean }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const refecthData = useRefetchAddressData();

  const onMint = async () => {
    setIsLoading(true);
    try {
      await mintMockNFT(address);
      refecthData(address, true);
    } catch (err: any) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  if(error)
    return (
      <div className={styles.error}>
        <span className={styles.errorTitle}><ErrorIcon /> An error ocurred!</span>
        <span className={styles.errorMessage}>{error.message}</span>
        <a href='https://github.com/australopitech/venn-protocol/issues' target='_blank' className={styles.textLink}>Report this Issue</a>
        <button className={styles.mintButton} onClick={() => setError(false)}>
          Back
        </button>
      </div>  
    )
  
  return (
    <div className={styles.noNFTs}>
      <img src='/drawing-desert.png' className={styles.noNFTsImage} alt='desert'/>
      <span className={styles.noNFTsTitle}>No NFTs to show.</span>
      {isSigner &&
      <>
        <div className={styles.buttonContainer}>
          {isLoading
           ? <button className={styles.mintButton}><LoadingDots /></button>
           : <button className={styles.mintButton} onClick={() => onMint()}>
              <MintIcon/> Mint a mock test-NFT
             </button>}
        </div>
        <Link className={styles.buttonContainer} href='/'>
          <button className={styles.mintButton}>
            <StoreIcon/> Go to Market Place
          </button>
        </Link>
      </>
      }
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

  // console.log('isLoadingData', isLoadingData)
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

  console.log("'nft's'", nftFetchData?.data?.nfts? nftFetchData?.data?.nfts : '')
  return (
    <div className={styles.nftArea}>
      <div className={styles.nftGridTitle}>
        <span className={styles.titleText}>
          Owned/Rented by {(address === vsa || address === eoa || !address && (vsa || eoa)) 
          ? 'You' 
          : <Tooltip position='top' text={tooltipText}>
              <span className={styles.address} onClick={() => handleAddressClick()}>
                {compactString(address)}
              </span>
            </Tooltip>
          }
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
                 ? <NoNFTs address={address ?? vsa ?? eoa ?? ''} isSigner={!!eoa} />
                 : nftFetchData.data.nfts
                    //  .filter(nft => nft.isRental === (viewMode === 'rented'))
                    .map((nft, i) =>
                    <NftCard
                      imageURI={
                        nft.imageCached ?? nft.image ?? "" // TODO substitute for no image symbol
                      }
                      name={nft.name ?? ""}
                      contractAddress={getAddress(nft.contractAddress)}
                      tokenId={nft.tokenId !== null ? BigInt(nft.tokenId) : undefined}
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
