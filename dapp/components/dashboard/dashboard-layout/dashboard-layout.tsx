import styles from './dashboard-layout.module.css';
import classNames from 'classnames';
import NavBar from '@/components/common/navbar/navbar'
import SideBar from '@/components/dashboard/sidebar/sidebar'
import NftArea from '@/components/dashboard/nft-area/nft-area'
import { useSigner } from '@usedapp/core';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@/components/common/navbar/navbar';

export interface DashboardLayoutProps {
  address?: string;
}

export default function DashboardLayout ({ address }: DashboardLayoutProps) {

  // const isWalletConnected = true; //temp
  const signer = useSigner();
  const [signerAddress, setSignerAddress] = useState<string>();

  useEffect(() => {
    if(signer) {
      signer.getAddress().then((r) => setSignerAddress(r))
    }
  }, [signer]);

  return (
    <div className={styles.dashboard} >
      <NavBar navbarGridTemplate={styles.navbarGridTemplate} currentPage='dashboard' />
      { (signer || address)
        ? <div className={styles.contentGridTemplate}> 
            <SideBar address={address}/>
            <SideBar address={address? address : signerAddress}/>
            <NftArea  address={address}/> 
          </div>
        : <div className={styles.notConnectedTemplate}>
            <div className={styles.notConnectedContainer}>
              <div className={styles.ellipses}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className={styles.notConnectedMessage}>Connect a wallet <br /> to see your dashboard</span>
              <ConnectButton connectText='Connect'/>
            </div>
          </div>
      }
    </div>
  );
}
