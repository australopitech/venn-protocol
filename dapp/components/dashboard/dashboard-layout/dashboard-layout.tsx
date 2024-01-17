'use client'
import styles from './dashboard-layout.module.css';
import classNames from 'classnames';
import NavBar from '@/components/common/navbar/navbar'
import SideBar from '@/components/dashboard/sidebar/sidebar'
import NftArea from '@/components/dashboard/nft-area/nft-area'
// import { useSigner } from '@usedapp/core';
import { useEffect, useState } from 'react';
// import { ConnectButton } from '@/components/common/navbar/navbar';
import { NFTDialog } from '@/components/common/nft-dialog/nft-dialog';
import { useAddressNfts } from '../../../hooks/address-data';
import { nftViewMode, nftViewContext } from '@/types/nftContext';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import 'node_modules/@rainbow-me/rainbowkit/dist/index.css';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createWeb3AuthSigner } from '@/utils/web3auth';
import { useSmartAccountAddress, useVsaUpdate } from '@/app/venn-provider';
import { useRouter } from 'next/navigation';

export interface DashboardLayoutProps {
  address?: `0x${string}`;
}

export interface ConnectButtonProps {
  handler: any;
  style?: any,
  connectText?: string
}

export function ConnectButton ({handler, style, connectText}: ConnectButtonProps) {
  return (
    <div className={style} onClick={handler}>
      {connectText ?? 'Connect Wallet'}
    </div>
  )
}


export default function DashboardLayout ({ address }: DashboardLayoutProps) {
  const [isNFTOpen, setIsNFTOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(0);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  
  const { address: eoa, connector } = useAccount();
  
  const [nftsMode, setNftsMode] = useState<nftViewMode>("owned");
  const vsa = useSmartAccountAddress();
  const vsaUpdate = useVsaUpdate();

  const userData = useAddressNfts(address?? eoa?? vsa);
  const { openConnectModal } = useConnectModal();
  
  // const router = useRouter();
  
  // useEffect(() => {
  //   if(!address && !eoa && !vsa) {
  //     router.push('/sign-in');
  //   }
  // }, [address, eoa, vsa])

  useEffect(() => {
    if(vsaUpdate) {
      if(!eoa)
        vsaUpdate();
    }
  }, [eoa, vsaUpdate]);

  console.log('vsa', vsa)
  console.log('eoa', eoa);

  return (
    <>
    {isNFTOpen && 
      <NFTDialog
        setIsNFTOpen={setIsNFTOpen} 
        nftItem={
          userData.nfts ? userData.nfts[selectedNFT] : undefined
        }
        address={address}
      />
    }
      <div className={styles.dashboard} >
        <NavBar navbarGridTemplate={styles.navbarGridTemplate} currentPage='dashboard' />
        { (eoa || vsa || address)
          ? <div className={styles.contentGridTemplate}> 
              <SideBar address={address?? vsa ?? vsa}
                      nftsContext={{mode: nftsMode, setNftsViewMode: setNftsMode}}/>
              <NftArea address={address}
                      nftFetchData={userData}
                      setIsNFTOpen={setIsNFTOpen}
                      setSelectedNFT={setSelectedNFT}
                      viewMode={nftsMode}/> 
            </div>
          : <div className={styles.notConnectedTemplate}>
          <div className={styles.notConnectedContainer}>
            <div className={styles.ellipses}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className={styles.notConnectedMessage}>Connect a wallet <br /> to see your dashboard</span>
            <div className={styles.connectButtonContainer}>
              <ConnectButton style={styles.connectButton} connectText='Connect' handler={openConnectModal} />
            </div>
          </div>
        </div>
        }
      </div>

    </>
  );
}
