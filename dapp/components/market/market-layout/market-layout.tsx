import styles from './market-layout.module.css';
import classNames from 'classnames';
import NavBar from '@/components/common/navbar/navbar'
import CollectionCard from '@/components/common/collection-card/collection-card';
import React, { useRef, useState } from 'react';
import NftCard from '@/components/common/nft-card/nft-card';
import { NFTDialog } from '@/components/common/nft-dialog/nft-dialog';
// import Swipe from 'react-swipe';

interface TrendingCollectionsSlider {
  collectionsData?: Array<any> | [];
}

interface MarketLayoutProps {
  somePropHere?: string;
}

const Header = () => {
  return (
    <>
      <h1 className={styles.heroTitle}>Unlock the <br />value of NFTs</h1>
      <h2 className={styles.heroSubtitle}> Beyond buying and selling: <br /> <span className={styles.textHilight}>lend</span> and <span className={styles.textHilight}>borrow</span> NFTs with ease</h2>
      {/* <h2 className={styles.heroSubtitle}> Beyond buying and selling: <br /> lend and borrow NFTs with ease</h2> */}
    </>
  )
}

const HeroSection = () => {
  return (
    <div className={styles.hero}>
      <Header />
      <div className={styles.heroButtons}>
        <span className={styles.secondaryButton}>About the Project</span>
        <span className={styles.primaryButton}>Get Started</span>
      </div>
    </div>
  )
}

const TrendingCollectionsSlider = ({ collectionsData }: TrendingCollectionsSlider) => {
  const [isDragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
      className={styles.trending}
    >
      <h1 className={styles.trendingTitle}>
        Trending Collections
      </h1>
      <div>
        <div
          className={styles.trendingContent}
          ref={sliderRef}
          onPointerDown={startDrag}
          onPointerMove={doDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          {collectionsData?.map(data => 
            <CollectionCard 
              uri={data.uri} 
              name={data.name} 
              floor={data.floor} 
              key={data.uri}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function MarketLayout ({ somePropHere }: MarketLayoutProps) {
  const [isNFTOpen, setIsNFTOpen] = useState(false);

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
    {name: "Awesome NFT #1.2", price: 0.125, isRented: true, expireDate: '2 days', uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3371.png"},
    {name: "Awesome NFT #2", price: 0.1, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/6020.png"},
    {name: "Awesome NFT #3", price: 0.012, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/8488.png"},
    {name: "Awesome NFT #4", price: 0.016, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3913.png"},
    {name: "Awesome NFT #5", uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
    {name: "Awesome NFT #0", price: 0.01, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/2944.png"},
    {name: "Awesome NFT #1", price: 0.02, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3808.png"},
    {name: "Awesome NFT #1.2", price: 0.125, isRented: true, expireDate: '2 days', uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3371.png"},
    {name: "Awesome NFT #2", price: 0.1, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/6020.png"},
    {name: "Awesome NFT #3", price: 0.012, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/8488.png"},
    {name: "Awesome NFT #4", price: 0.016, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3913.png"},
    {name: "Awesome NFT #5", uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
    {name: "Awesome NFT #5", uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
    {name: "Awesome NFT #5", uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
    {name: "Awesome NFT #5", uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
    {name: "Awesome NFT #5", uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
    {name: "Awesome NFT #5", uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
    {name: "Awesome NFT #5", uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
  ]

  return (
    <>
      {isNFTOpen && 
        <NFTDialog
          // contract={contract}
          // id={tokenId}
          // index={index}
          setIsNFTOpen={setIsNFTOpen} 
          // context={context}
          // activeAccount={activeAccount}
          // isOwned={isOwned}
          // isBorrowed={isBorrowed}
        />
      }
      <div className={styles.market} >
        <NavBar navbarGridTemplate={styles.navbarGridTemplate} currentPage='market' />
        <div className={styles.contentGridTemplate}> 
          <HeroSection />
          <TrendingCollectionsSlider collectionsData={collectionsData} />
          <div className={styles.latest}>
            <h1>
              Latest NFTs
            </h1>
            <div className={styles.nftGridContent}>
              <div className={styles.cardGrid}>
                {nftsData.map(data => 
                  <NftCard 
                    imageURI={data.uri} 
                    name={data.name} 
                    price={data.price}
                    isRented={data.isRented}
                    expireDate={data.expireDate}
                    key={data.uri}
                  />
                )}
              </div>
              {/** BEGIN ghost cards to maintain grid proportions: width is the same as NftCard component */}
              {/** IMPORTANT: do not remove the next 3 rows! */}
              {/* <div className={styles.ghostCard} /> */}
              {/* <div className={styles.ghostCard} /> 
              <div className={styles.ghostCard} /> */}
              {/* <div className={styles.ghostCard} /> */}
              {/** END */}
            </div>
          </div>
        </div>
      </div>
    </>
    
  );
}
