import NavBar, { NavbarEvader } from '@/components/common/navbar/navbar';
import styles from './new-dashboard-layout.module.css';
import Profile from '../profile/profile';
import NftArea from '../nft-area/new-nft-area';

export default function NewDashboardLayout () {

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={styles.body}>
                <NavBar currentPage='dashboard' />
                <NavbarEvader/>
                <div className={styles.main}>
                    <Profile/>
                    <div className={styles.divider}></div>
                    <NftArea/>
                </div>
            </div>
        </div>
    )
}