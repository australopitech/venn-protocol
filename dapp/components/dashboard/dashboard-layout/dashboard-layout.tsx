import styles from './dashboard-layout.module.css';
import classNames from 'classnames';
import NavBar from '@/components/common/navbar/navbar'
import SideBar from '@/components/dashboard/sidebar/sidebar'
import NftArea from '@/components/dashboard/nft-area/nft-area'


export interface DashboardLayoutProps {
  somePropHere?: string;
}

export default function DashboardLayout ({ somePropHere }: DashboardLayoutProps) {

  const isWalletConnected = true; //temp
  
  return (
    <div className={styles.dashboard} >
      <NavBar navbarGridTemplate={styles.navbarGridTemplate} currentPage='dashboard' />
      { isWalletConnected
        ? <div className={styles.contentGridTemplate}> 
            <SideBar  />
            <NftArea  /> 
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
  );
}
