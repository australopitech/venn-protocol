'use client'
import styles from './market-layout.module.css';
import classNames from 'classnames';
import NavBar from '@/components/common/navbar/navbar'
import CollectionCard from '@/components/common/collection-card/collection-card';
import React, { useRef, useState, useEffect } from 'react';
import NftCard from '@/components/common/nft-card/nft-card';
import { NFTDialog } from '@/components/common/nft-dialog/nft-dialog';
import { CollectionDialog } from '@/components/common/collection-dialog/collection-dialog';
import Link from 'next/link';
import 'node_modules/@rainbow-me/rainbowkit/dist/index.css';
import { useAddressNfts, useRefetchAddressData } from '@/hooks/address-data';
import { getMktPlaceContractAddress } from '@/utils/contractData';
import { ApproveData, TxResolved } from '@/types';
import { useSessionEvent, useSmartAccount, useVennWallet } from '@/app/account/venn-provider';
import { 
  resolveApprovalExternal, resolveApprovalInternal, rejectSessionProposal, rejectSessionRequest 
} from '@/app/account/wallet';
import ApproveDialog from '@/components/common/approve-dialog/approve-dialog';
// import Swipe from 'react-swipe';

interface TrendingCollectionsSliderProps {
  collectionsData?: Array<any> | [];
}

interface ContentSliderProps {
  title: string;
  contentType: 'nft' | 'collection';
  contentSliderData?: Array<any> | [] | null;
  setIsOpen: any;
  setSelected?: any;
}

interface MarketLayoutProps {
  somePropHere?: string;
}

const collectionsData = [
  {name: "Super Ultra Awesome Collection", floor: 0.02,  uri: "https://dl.openseauserdata.com/cache/originImage/files/a0e0ab6a2841ae56d4ba63f833ebbca2.png"},
  {name: "Super Ultra Awesome Collection", floor: 0.125, uri: "https://dl.openseauserdata.com/cache/originImage/files/f43854be2b27048ab8de384240d3f412.png"},
  {name: "Super Ultra Awesome Collection", floor: 0.1,   uri: "https://dl.openseauserdata.com/cache/originImage/files/3796350cc56413cecf310d291947f8d7.png"},
  {name: "Super Ultra Awesome Collection", floor: 0.01,  uri: "https://dl.openseauserdata.com/cache/originImage/files/5c1dc7b1b8e4f8703e37980aaf538dec.jpg"},
  {name: "Super Ultra Awesome Collection", floor: 0.012, uri: "https://dl.openseauserdata.com/cache/originImage/files/3daf810c1c02eca4109ae93346980a5d.gif"},
  {name: "Super Ultra Awesome Collection", floor: 0.016, uri: "https://dl.openseauserdata.com/cache/originImage/files/2e3d1f319bc99157344c713abe78adc7.jpg"},
  {name: "Super Ultra Awesome Collection",               uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
]

const nftsData = [
  {name: "Awesome NFT #0", price: 0.01, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/2944.png"},
  {name: "Awesome NFT #1", price: 0.02, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3808.png"},
  {name: "Awesome NFT #2", price: 0.1, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/6020.png"},
  {name: "Awesome NFT #3", price: 0.012, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/8488.png"},
  {name: "Awesome NFT #4", price: 0.016, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3913.png"},
  {name: "Awesome NFT #5", price: 0.0123, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
  {name: "Awesome NFT #0", price: 0.01, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/2944.png"},
  {name: "Awesome NFT #1", price: 0.02, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3808.png"},
  {name: "Awesome NFT #2", price: 0.1, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/6020.png"},
  {name: "Awesome NFT #3", price: 0.012, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/8488.png"},
]


const Header = () => {
  return (
    <>
      <h1 className={styles.heroTitle}>Unlock the <br />value of NFTs</h1>
      <h2 className={styles.heroSubtitle}> Beyond buying and selling: <br /> <span className={styles.textHilight}>lend</span> and <span className={styles.textHilight}>borrow</span> NFTs with ease</h2>
      {/* <h2 className={styles.heroSubtitle}> Beyond buying and selling: <br /> lend and borrow NFTs with ease</h2> */}
    </>
  )
}

const HeroIcon = () => {
  return (
    <svg className={styles.heroIcon} fill="#FFF" width="400px" height="400px" viewBox="0 0 7 7" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.719 6.388c-0.025 -0.122 -0.251 -0.396 -0.328 -0.396 -0.083 0 -0.052 -0.05 0.067 -0.108a0.505 0.505 0 0 0 0.202 -0.229l0.089 -0.173 0.087 0.173a0.5 0.5 0 0 0 0.202 0.229c0.117 0.058 0.15 0.108 0.07 0.108 -0.076 0 -0.266 0.221 -0.317 0.369l-0.05 0.139 -0.022 -0.112zm-2.185 -0.327c-0.038 -0.191 -0.227 -0.421 -0.417 -0.509l-0.175 -0.081 0.114 -0.025c0.166 -0.036 0.411 -0.297 0.463 -0.491 0.024 -0.088 0.052 -0.16 0.064 -0.16 0.011 0 0.04 0.072 0.063 0.16 0.052 0.195 0.297 0.455 0.464 0.491l0.114 0.025 -0.177 0.082c-0.2 0.092 -0.378 0.306 -0.413 0.496 -0.028 0.148 -0.069 0.153 -0.098 0.012zm2.304 -1.589a0.318 0.318 0 0 0 -0.128 -0.142l-0.082 -0.037 0.121 -0.115c0.067 -0.063 0.121 -0.143 0.121 -0.18 0 -0.05 0.017 -0.038 0.068 0.044a0.68 0.68 0 0 0 0.148 0.167l0.082 0.057 -0.082 0.057a0.64 0.64 0 0 0 -0.141 0.155l-0.06 0.099 -0.047 -0.105zm1.679 -0.367a0.801 0.801 0 0 1 -0.045 -0.155 1.52 1.52 0 0 0 -0.321 -0.599c-0.129 -0.142 -0.431 -0.316 -0.558 -0.32 -0.04 0 -0.006 -0.023 0.075 -0.049a1.105 1.105 0 0 0 0.506 -0.327c0.13 -0.148 0.315 -0.52 0.315 -0.633 0 -0.139 0.061 -0.118 0.085 0.028 0.03 0.188 0.169 0.458 0.324 0.63 0.129 0.142 0.431 0.316 0.558 0.32 0.04 0 0.006 0.022 -0.075 0.048 -0.395 0.123 -0.682 0.449 -0.798 0.905 -0.025 0.101 -0.055 0.168 -0.066 0.15zM2.59 3.433c-0.035 -0.22 -0.222 -0.468 -0.434 -0.579 -0.178 -0.092 -0.18 -0.095 -0.082 -0.114 0.209 -0.042 0.52 -0.437 0.53 -0.674 0.002 -0.039 0.036 0.024 0.076 0.138 0.086 0.248 0.31 0.492 0.489 0.533l0.119 0.027 -0.123 0.05c-0.235 0.096 -0.421 0.324 -0.511 0.624l-0.041 0.139 -0.023 -0.143zM1.393 2.55c-0.026 -0.167 -0.165 -0.445 -0.305 -0.615a1.2 1.2 0 0 0 -0.362 -0.255c-0.14 -0.068 -0.225 -0.123 -0.191 -0.123 0.116 0 0.399 -0.17 0.532 -0.319 0.146 -0.163 0.338 -0.535 0.338 -0.659 0 -0.127 0.059 -0.091 0.082 0.05 0.058 0.353 0.429 0.803 0.741 0.895l0.158 0.046 -0.244 0.118a0.983 0.983 0 0 0 -0.382 0.292c-0.128 0.162 -0.283 0.499 -0.283 0.614 0 0.112 -0.064 0.078 -0.083 -0.044zm2.62 -0.655c-0.003 -0.107 -0.137 -0.295 -0.245 -0.344l-0.1 -0.044 0.11 -0.072a0.683 0.683 0 0 0 0.184 -0.219l0.074 -0.146 0.074 0.153a0.493 0.493 0 0 0 0.183 0.21l0.109 0.056 -0.117 0.077a0.701 0.701 0 0 0 -0.195 0.236c-0.045 0.093 -0.079 0.131 -0.079 0.092z"/>
    </svg>
  )
}

const HeroSection = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroText}>
        <Header />
        <div className={styles.heroButtons}>
          <span className={styles.secondaryButton}>
            <a href="https://github.com/pbfranceschin/r-wallet-base-3">
              About the Project
            </a>
            </span>
          <span className={styles.primaryButton}>
            <Link href="/dashboard/0x099A294Bffb99Cb2350A6b6cA802712D9C96676A"> 
              Get Started
            </Link>
          </span>
        </div>
      </div>
      <HeroIcon />
    </div>
  )
}

const ContentSlider = ({ title, contentType, contentSliderData, setIsOpen, setSelected }: ContentSliderProps) => {
  const [isDragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleOnCardClick = (i: number) => {
    if(contentType === 'nft') setSelected(i);
    setIsOpen(true);
  }

  const sliderRef = useRef<HTMLDivElement | null>(null);

  const startDrag = (e: any) => {
    setDragging(true);
    setStartX(e.clientX || e.touches[0].clientX);
    if (sliderRef.current) {
      setScrollLeft(sliderRef.current.scrollLeft);
    }
  };

  const doDrag = (e: any) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.clientX || e.touches[0].clientX;
    const walk = (x - startX);
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const stopDrag = () => {
    setDragging(false);
  };

  return (
    <div 
      className={styles.slider}
    >
      <h1 className={styles.sliderTitle}>
        {title}
      </h1>
      <div>
        <div
          // className={contentType === "nft" ? styles.nftSliderContent : styles.sliderContent}
          className={contentType === "nft" ? styles.nftSliderContent : styles.sliderContent}
          ref={sliderRef}
          onPointerDown={startDrag}
          onPointerMove={doDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          {contentSliderData?.map((data, i) => 
            contentType === "nft" 
            ? <NftCard 
                imageURI={data.image} 
                name={data.name}
                contractAddress={data.contractAddress}
                tokenId={BigInt(data.tokenId)}
                // price={data.price}
                // isRented={data.isRented}
                // expireDate={data.expireDate}
                currentPage='market'
                key={data.contractAddress + data.tokenId}
                onClick={() => handleOnCardClick(i)}
              />
            : <CollectionCard 
                uri={data.uri} 
                name={data.name} 
                floor={data.floor} 
                key={data.uri}
                onClick={handleOnCardClick}
              />
          )}
        </div>
      </div>
    </div>
  )
}

export default function MarketLayout ({ somePropHere }: MarketLayoutProps) {
  const [isNFTOpen, setIsNFTOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(0);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  // const [isConnectOpen, setIsConnectOpen] = useState(false);
  const marketNfts = useAddressNfts(getMktPlaceContractAddress());

  const [approveData, setApproveData] = useState<ApproveData>();
  const [txResolved, setTxResolved] = useState<TxResolved>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { event, data } = useSessionEvent();
  const refecthData = useRefetchAddressData();
  const { wallet, stateResetter } = useVennWallet();
  const { provider } = useSmartAccount();

  useEffect(() => {
    console.log('render');
    if(txResolved) {
      refecthData(getMktPlaceContractAddress(), true);
      setIsNFTOpen(false);
    }
  }, [txResolved]);

  const onApprove = async () => {
    setLoading(true);
    let _hash: any;
    let _err: any;
    if(event) {
      if(!wallet) {
        setError({ message: 'no wallet found' });
        setLoading(false);
        return
      }
      if(!data) {
        setError({message: 'missing request metadata'})
        setLoading(false)
        return
      }
      const { hash, error: err } = await resolveApprovalExternal(event, data, stateResetter, wallet, provider);
      _hash = hash;
      _err = err;
    } else {
      if(!provider) {
        setError({ message: 'no provider found '});
        setLoading(false);
        return
      }
      if(!approveData) {
        setError({message: 'missing tx metadata'});
        setLoading(false)
        return
      }
      const { hash, error: err} = await resolveApprovalInternal(approveData.data, provider);
      _hash = hash;
      _err = err;
    }
    setError(_err);
    if(!event || event === 'Transaction')
      setTxResolved({ success: !_err , hash: _hash });
    setLoading(false);
  }

  const onReject = async () => {
    setLoading(true);
    if(event){
      switch (event) {
        case 'Connection':
          try {
            await rejectSessionProposal(data, stateResetter, wallet);
          } catch (err: any) { 
            setError(err);
          } finally {
            setLoading(false);
          }
          break
        case 'Transaction':
        case 'Signature':
          try {
            await rejectSessionRequest(data, stateResetter, wallet);
          } catch (err: any) {
            setError(err);
          } finally {
            setLoading(false);
          }
          break;
      }
    } else 
      resetState()
  }

  const resetState = () => {
    setError(undefined);
    setTxResolved(undefined);
    setApproveData(undefined);
    setLoading(false);
    // resetWalletUi();
  };



  return (
    <>
      {isNFTOpen && 
        <NFTDialog
          setApproveData={setApproveData}
          setTxResolved={setTxResolved}
          setError={setError}
          txLoading={loading || !!event || !!approveData}
          txResolved={txResolved}
          nftItem={
            marketNfts.data?.nfts ? marketNfts.data.nfts[selectedNFT] : undefined
          }
          setIsNFTOpen={setIsNFTOpen} 
        />
      }
      {
        isCollectionOpen &&
        <CollectionDialog
          setIsCollectionOpen={setIsCollectionOpen} 
        />
      }
      {(event || approveData || error || txResolved) && 
      <ApproveDialog 
      approveData={approveData? approveData : event? {type: event, data} : undefined}
      onApprove={onApprove}
      onReject={onReject}
      onClose={resetState}
      loading={loading}
      error={error}
      txResolved={txResolved}
      />
      }
      <div className={styles.market} >
        <NavBar navbarGridTemplate={styles.navbarGridTemplate} currentPage='market' />
        {<div className={styles.contentGridTemplate}> 
          <HeroSection />
          <ContentSlider title={"Latest NFTs"} contentType={"nft"} contentSliderData={marketNfts.data?.nfts} setIsOpen={setIsNFTOpen} setSelected={setSelectedNFT} />
          <ContentSlider title={"Trending Collections"} contentType={"collection"} contentSliderData={collectionsData} setIsOpen={setIsCollectionOpen} />
        </div>}
      </div>
    </>
    
  );
}
