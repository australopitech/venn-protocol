import NftCard from '@/components/common/nft-card/nft-card';
import styles from './nft-area.module.css';
import classNames from 'classnames';
import { useState } from 'react';

export interface NftAreaProps {
  nftAreaGridTemplate?: string;
  setIsNFTOpen: any;
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

export default function NftArea ({ nftAreaGridTemplate, setIsNFTOpen }: NftAreaProps) {
  const [toggleState, setToggleState] = useState<boolean>(false);

  const handleToggle = (state: boolean) => {
    setToggleState(state);
    console.log('Toggle state:', state);
  };

  const handleOnCardClick = () => {
    setIsNFTOpen(true);
  }

  const nftsData = [
    {name: "Awesome NFT #0", price: 0.01, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/2944.png"},
    {name: "Awesome NFT #1", price: 0.02, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3808.png"},
    {name: "Awesome NFT #1.2", price: 0.125, isRented: true, expireDate: '2 days', uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3371.png"},
    {name: "Awesome NFT #2", price: 0.1, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/6020.png"},
    {name: "Awesome NFT #3", price: 0.012, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/8488.png"},
    {name: "Awesome NFT #4", price: 0.016, isRented: false, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3913.png"},
    {name: "Awesome NFT #5", uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3370.png"},
  ]

  const x = {name: "Awesome NFT #4", price: 0.016, uri: "https://ipfs.io/ipfs/QmYCXBMG4BMuoXxkHbGR2GpmJPySJH4HDLMU9eDZkYUNjd/3913.png"}
  
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
          {nftsData.map(data => 
            <NftCard 
              imageURI={data.uri} 
              name={data.name} 
              price={data.price}
              isRented={data.isRented}
              expireDate={data.expireDate}
              key={data.uri}
              onClick={handleOnCardClick}
            />
          )}
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
