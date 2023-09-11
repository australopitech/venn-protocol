import { useState } from 'react';
import styles from './dashboard-layout.module.css';
import classNames from 'classnames';
import NavBar from '@/components/common/navbar/navbar'
import SideBar from '@/components/dashboard/sidebar/sidebar'
import NftArea from '@/components/dashboard/nft-area/nft-area'
import { NFTDialog } from '@/components/common/nft-dialog/nft-dialog';


export interface DashboardLayoutProps {
  address?: string;
}

export default function DashboardLayout ({ address }: DashboardLayoutProps) {
  const [isNFTOpen, setIsNFTOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);

  const isWalletConnected = true; //temp
  
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
      <div className={styles.dashboard} >
        <NavBar navbarGridTemplate={styles.navbarGridTemplate} currentPage='dashboard' />
        { (isWalletConnected && address)
          ? <div className={styles.contentGridTemplate}> 
              <SideBar address={address}/>
              <NftArea setIsNFTOpen={setIsNFTOpen} /> 
            </div>
          : <div className={styles.notConnectedTemplate}>
              <div className={styles.notConnectedContainer}>
                <div className={styles.ellipses}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className={styles.notConnectedMessage}>Connect a wallet <br /> to see your dashboard</span>
                <div className={styles.connectButton}>Connect</div>
              </div>
            </div>
        }
      </div>
    </>
  );
}
