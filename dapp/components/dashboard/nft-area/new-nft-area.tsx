'use client'
import styles from './new-nft-area.module.css';
import { useState } from 'react';
import classNames from 'classnames';

export default function NftArea () {

    return (
        <div className={styles.nftArea}>
            <div className={styles.nftAreaHeader}>
                <div className={styles.nftQuantity}>12 NFTs</div>
                <ToggleSwitch onToggle={() => {}}/>
            </div>
            <div className={styles.nftGrid}>
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
            </div>
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