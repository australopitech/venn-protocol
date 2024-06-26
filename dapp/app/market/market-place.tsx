'use client'

import MarketLayout from '@/components/market/market-layout/market-layout'
import { WorkInProgressDialog } from '@/components/common/work-in-progress-dialog/work-in-progress-dialog';
import { useEffect, useState } from 'react';

export default function Market() {
  const [isWorkInProgressOpen, setIsWorkInProgressOpen] = useState(false);

    useEffect(() => {
        const expireDuration = 5 * 60 * 1000; 

        const hasVisited = localStorage.getItem('hasVisited');
        const visitTimestamp = localStorage.getItem('visitTimestamp');

        const isExpired = visitTimestamp 
            ? (new Date().getTime() - Number(visitTimestamp)) > expireDuration
            : false;

        if (!hasVisited || isExpired) {
          setIsWorkInProgressOpen(true);
          const currentTime = new Date().getTime();
          localStorage.setItem('hasVisited', 'true');
          localStorage.setItem('visitTimestamp', currentTime.toString());
        }
    }, []);

  return (
    <>
      {/* <div className={styles.dashboard} >
        <NavBar navbarGridTemplate={styles.navbarGridTemplate} />
        <SideBar sidebarGridTemplate={styles.sidebar} />
        <NftArea nftAreaGridTemplate={styles.content} /> 
      </div> */}
      {isWorkInProgressOpen && <WorkInProgressDialog setIsWorkInProgressOpen={setIsWorkInProgressOpen}/>}
      <MarketLayout />
    </>
  )
}