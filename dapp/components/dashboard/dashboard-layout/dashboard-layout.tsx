'use client'
import styles from './dashboard-layout.module.css';
import NavBar from '@/components/common/navbar/navbar'
import SideBar from '@/components/dashboard/sidebar/sidebar'
import NftArea from '@/components/dashboard/nft-area/nft-area'
import { useEffect, useState, useCallback } from 'react';
import { NFTDialog } from '@/components/common/nft-dialog/nft-dialog';
import { useAddressNfts } from '../../../hooks/address-data';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import 'node_modules/@rainbow-me/rainbowkit/dist/index.css';
import { 
  useSmartAccount, useSessionEvent, useVennWallet 
} from '@/app/account/venn-provider';
import { 
  rejectSessionProposal, rejectSessionRequest,
  resolveApprovalExternal, resolveApprovalInternal
} from '@/app/account/wallet';
import ApproveDialog from '@/components/common/approve-dialog/approve-dialog';
import { ApproveData, TxResolved, nftViewMode } from '@/types';


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
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openConnect, setOpenConnect] = useState(false);
  const [nftsMode, setNftsMode] = useState<nftViewMode>("owned");

  const { address: eoa } = useAccount();
  const { provider: vsa, address: vsaAddr } = useSmartAccount();
  const { wallet, stateResetter } = useVennWallet();

  const userData = useAddressNfts(address?? vsaAddr?? eoa);
  const { openConnectModal } = useConnectModal();
  const [txResolved, setTxResolved] = useState<TxResolved>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { event, data } = useSessionEvent();
  const [approveData, setApproveData] = useState<ApproveData>();
  
  // console.log('vsa', vsa)

  const resetWalletUi = useCallback(() => {
    setOpenTransfer(false);
    setOpenConnect(false);
  }, [setOpenTransfer, setOpenConnect]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [])
  

  const onApprove = async () => {
    setLoading(true);
    let _hash: any;
    let _err: any;
    if(event) {
      if(!wallet) {
        setError({ message: 'no wallet found' });
        setLoading(false);
        return
      }
      if(!data) {
        setError({message: 'missing request metadata'})
        setLoading(false)
        return
      }
      const { hash, error: err } = await resolveApprovalExternal(event, data, stateResetter, wallet, vsa);
      _hash = hash;
      _err = err;
    } else {
      if(!vsa) {
        setError({ message: 'no provider found '});
        setLoading(false);
        return
      }
      if(!approveData) {
        setError({message: 'missing tx metadata'});
        setLoading(false)
        return
      }
      const { hash, error: err} = await resolveApprovalInternal(approveData.data, vsa);
      _hash = hash;
      _err = err;
    }
    setError(_err);
    if(!event || event === 'Transaction')
      setTxResolved({ success: !_err , hash: _hash });
    setLoading(false);
    resetWalletUi();
  }


  const onReject = useCallback(async () => {
    setLoading(true);
    if(event){
      switch (event) {
        case 'Connection':
          try {
            await rejectSessionProposal(data, stateResetter, wallet);
          } catch (err: any) {
            setError(err);
          } finally {
            setLoading(false);
          }
          break
        case 'Transaction':
        case 'Signature':
          try {
            await rejectSessionRequest(data, stateResetter, wallet);
          } catch (err: any) {
            setError(err);
          } finally {
            setLoading(false);
          }
          break;
      }
    } else 
      resetState()
  },[
    event, setLoading, setError
  ]);

  const resetState = () => {
    setError(undefined);
    setTxResolved(undefined);
    setApproveData(undefined);
    setLoading(false);
    resetWalletUi();
  };

  console.log('userData', userData)

  return (
    <>
    {isNFTOpen && 
      <NFTDialog
        setIsNFTOpen={setIsNFTOpen}
        setApproveData={setApproveData}
        setTxResolved={setTxResolved}
        setError={setError}
        txLoading={loading}
        nftItem={
          userData.nfts ? userData.nfts[selectedNFT] : undefined
        }
        address={address}
      />
    }
    {(event || approveData || error || txResolved) && 
      <ApproveDialog 
      approveData={approveData? approveData : event? {type: event, data} : undefined}
      onApprove={onApprove}
      onReject={onReject}
      onClose={resetState}
      loading={loading}
      error={error}
      txResolved={txResolved}
      />
    }
      <div className={styles.dashboard} >
        <NavBar navbarGridTemplate={styles.navbarGridTemplate} currentPage='dashboard' />
        { (eoa || address)
          ? <div className={styles.contentGridTemplate}> 
              <SideBar address={address?? vsaAddr ?? eoa ?? ''}
                      nftsContext={{mode: nftsMode, setNftsViewMode: setNftsMode}}
                      setApproveData={setApproveData}
                      openTransfer={openTransfer}
                      setOpenTransfer={setOpenTransfer}
                      openConnect={openConnect}
                      setOpenConnect={setOpenConnect}
              />
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
            {isClient
              ? <>            
                <span className={styles.notConnectedMessage}>Connect a wallet <br /> to see your dashboard</span>
                <div className={styles.connectButtonContainer}>
                  <ConnectButton style={styles.connectButton} connectText='Connect' handler={openConnectModal} />
                </div>
                </>
              : <>
                  <span className={styles.notConnectedMessage}>Loading... <br /><br /> Please Wait</span>
                </>            
            }
          </div>
        </div>
        }
      </div>

    </>
  );
}
