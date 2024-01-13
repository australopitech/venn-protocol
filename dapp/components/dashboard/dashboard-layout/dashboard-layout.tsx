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
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createWeb3AuthSigner } from '@/utils/web3auth';

export interface DashboardLayoutProps {
  address?: string;
}

export interface ConnectButtonProps {
  handler: any;
  style?: any,
  connectText?: string
}

export function SignInButton ({handler, style,  connectText}: ConnectButtonProps) {
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
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectMode, setConnectMode] = useState<'VSA'|'EOA'>();
  // const isWalletConnected = true; //temp
  // const signer = useSigner();
  const { address: account } = useAccount();
  // const [signerAddress, setSignerAddress] = useState<string>();
  const [nftsMode, setNftsMode] = useState<nftViewMode>("owned");

  // console.log('signer dashboard', signer)
  // console.log('signerAddress', signerAddress)

  // useEffect(() => {
  //   if(signer) {
  //     signer.getAddress().then((r) => setSignerAddress(r))
  //   }
  // }, [signer]);

  const userData = useAddressNfts(address? address : account);
  const { openConnectModal } = useConnectModal();

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
        <NavBar isConnectOpen={isConnectOpen} setIsConnectOpen={setIsConnectOpen} navbarGridTemplate={styles.navbarGridTemplate} currentPage='dashboard' />
        { !isConnectOpen && (account || address)
          ? <div className={styles.contentGridTemplate}> 
              <SideBar address={address? address : account}
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
                <span className={styles.notConnectedMessage}>Sign In<br /> to see your dashboard</span>
                {/* <ConnectButton connectText='Connect'/> */}
                <div className={styles.connectButtonsWrapper}>
                  <div className={styles.connectButtonContainer}>
                    <SignInButton style={styles.connectButton} connectText='VSA Sign In' handler={createWeb3AuthSigner} />
                    <div className={styles.descriptionTitle}>Sign In with a <b><i>Venn Smart Account</i></b>.<br/></div>
                    <div className={styles.descriptionText}>                    
                    You can <b>LIST</b> and <b>PURCHASE</b> NFT's as <b>rentals</b>.<br/>
                      Even if you <i>do not</i> have a VSA yet, you can proceed with the sign in to create one.<span className={styles.warningText}>[Recommended]</span>
                    </div>
                  </div>
                  <div className={styles.connectButtonContainer}>
                    <SignInButton style={styles.connectButton} connectText='EOA Sign In' handler={openConnectModal} />
                    {/* <ConnectButton /> */}
                    <div className={styles.descriptionTitle}>Sign In with a regular account.</div>
                    <div className={styles.descriptionText}>
                      Use a web3 wallet like Metamask, Coinbase Wallet, etc.<br/> 
                      You can still list your own NFT's to be rented, but can not purchase a rental yourself.
                    </div>
                    </div>
                  </div>
              </div>
            </div>
        }
      </div>

    </>
  );
}
