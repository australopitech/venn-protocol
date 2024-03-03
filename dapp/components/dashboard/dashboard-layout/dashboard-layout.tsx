'use client'
import styles from './dashboard-layout.module.css';
import NavBar from '@/components/common/navbar/navbar'
import SideBar from '@/components/dashboard/sidebar/sidebar'
import NftArea from '@/components/dashboard/nft-area/nft-area'
import { useEffect, useState, useCallback } from 'react';
import { NFTDialog } from '@/components/common/nft-dialog/nft-dialog';
import { useAddressNfts, useRefetchAddressData } from '../../../hooks/address-data';
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

export function LoadingDots () {
  return (
    <div className={styles.ellipses}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export function LoadingPage () {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)' 
    }}>
      <LoadingDots />
    </div>
  )
}


export function ConnectButton ({handler, style, connectText}: ConnectButtonProps) {
  return (
    <div className={style} onClick={handler}>
      {connectText ?? 'Connect Wallet'}
    </div>
  )
}

export default function DashboardLayout ({ address }: DashboardLayoutProps) {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isNFTOpen, setIsNFTOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(0);
  // const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openConnect, setOpenConnect] = useState(false);
  const [nftsMode, setNftsMode] = useState<nftViewMode>("owned");

  const { address: eoa, connector, isConnecting } = useAccount();
  const { provider, address: vsa } = useSmartAccount();
  const { wallet, stateResetter } = useVennWallet();

  const userData = useAddressNfts(address?? vsa?? eoa);
  const { openConnectModal } = useConnectModal();
  const [txResolved, setTxResolved] = useState<TxResolved>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { event, data } = useSessionEvent();
  const [approveData, setApproveData] = useState<ApproveData>();
  const refecthData = useRefetchAddressData();
  const [nftAreaTrigger, setNftAreaTrigger] = useState(false);

  const resetWalletUi = useCallback(() => {
    setOpenTransfer(false);
    setOpenConnect(false);
  }, [setOpenTransfer, setOpenConnect]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingPage(false);
    }, 3000);
  }, [])

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log('render');
    if(txResolved) {
      const resolveAddr = address ?? vsa ?? eoa
      if(resolveAddr) {
        refecthData(resolveAddr, true);
        setNftAreaTrigger(!nftAreaTrigger);
      }
      setIsNFTOpen(false);
    }
  }, [txResolved])
  
  const resolveDashBoardAccountAddress = () : `0x${string}` | undefined => {
    return connector?.id === "web3auth" ? vsa : eoa
  }

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
      const { hash, error: err } = await resolveApprovalExternal(event, data, stateResetter, wallet, provider);
      _hash = hash;
      _err = err;
    } else {
      if(!provider) {
        setError({ message: 'no provider found '});
        setLoading(false);
        return
      }
      if(!approveData) {
        setError({message: 'missing tx metadata'});
        setLoading(false)
        return
      }
      const { hash, error: err} = await resolveApprovalInternal(approveData.data, provider);
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
  console.log('txResolved', txResolved)
  
  const refetchTest = () => {
    const acc = address ?? vsa ?? eoa;
    if(acc) refecthData(acc, true)
  } 

  if(isLoadingPage)
    return (
      <div className={styles.loadingPage}><LoadingPage /></div>
    )
  
  return (
    <>
    {isNFTOpen && 
      <NFTDialog
        setIsNFTOpen={setIsNFTOpen}
        setApproveData={setApproveData}
        setTxResolved={setTxResolved}
        setError={setError}
        txLoading={loading || !!event || !!approveData}
        txResolved={txResolved}
        nftItem={
          userData.data?.nfts ? userData.data.nfts[selectedNFT] : undefined
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
            {eoa &&
              <SideBar address={resolveDashBoardAccountAddress()}
                      isConnecting={isConnecting}
                      nftsContext={{mode: nftsMode, setNftsViewMode: setNftsMode}}
                      setApproveData={setApproveData}
                      openTransfer={openTransfer}
                      setOpenTransfer={setOpenTransfer}
                      openConnect={openConnect}
                      setOpenConnect={setOpenConnect}
              />}
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
        <button onClick={refetchTest}>Refetch</button>
      </div>

    </>
  );
}
