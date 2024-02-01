'use client'
import styles from './dashboard-layout.module.css';
import classNames from 'classnames';
import NavBar from '@/components/common/navbar/navbar'
import SideBar from '@/components/dashboard/sidebar/sidebar'
import NftArea from '@/components/dashboard/nft-area/nft-area'
// import { useSigner } from '@usedapp/core';
import { useEffect, useState, useCallback } from 'react';
// import { ConnectButton } from '@/components/common/navbar/navbar';
import { NFTDialog } from '@/components/common/nft-dialog/nft-dialog';
import { useAddressNfts } from '../../../hooks/address-data';
import { nftViewMode, nftViewContext } from '@/types/nftContext';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import 'node_modules/@rainbow-me/rainbowkit/dist/index.css';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { createWeb3AuthSigner } from '@/utils/web3auth';
import { useSmartAccount, useVsaUpdate, useSessionDemand,
  useApproveSessionProposal, useApproveSessionRequest, 
  useRejectSessionProposal, useRejectSessionRequest, 
  SessionDemandType, useVennWallet } from '@/app/account/venn-provider';
import { approveSessionProposal } from '@/app/account/wallet';
// import { useRouter } from 'next/navigation';
import { TxResolved } from '@/components/common/approve-dialog/approve-dialog';
import ApproveDialog from '@/components/common/approve-dialog/approve-dialog';


export interface DashboardLayoutProps {
  address?: `0x${string}`;
}

export interface ConnectButtonProps {
  handler: any;
  style?: any,
  connectText?: string
}

export interface ApproveData {
  type: SessionDemandType | 'Transfer';
  data: any;
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

  const userData = useAddressNfts(address?? eoa?? vsaAddr);
  const { openConnectModal } = useConnectModal();
  const [txResolved, setTxResolved] = useState<TxResolved>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { demandType, data } = useSessionDemand();
  const [approveData, setApproveData] = useState<ApproveData>();
  // const [loggedIn, setLoggedIn] = useState<boolean>();
  const onApproveProposal = useApproveSessionProposal();
  const onRejectProposal = useRejectSessionProposal();
  const onApproveRequest = useApproveSessionRequest();
  const onRejectRequest = useRejectSessionRequest();

  const resetWalletUi = useCallback(() => {
    setOpenTransfer(false);
    setOpenConnect(false);
  }, [setOpenTransfer, setOpenConnect]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [])
  
  // console.log('vsa', vsa)
  // console.log('eoa', eoa);
  
  // useEffect(() => {
  //   if(demandType){
  //     setApproveData({type: demandType, data});
  //     setOpenApproveDialog(true);
  //   }
  //   else
  //     setOpenApproveDialog(false);
  // }, [demandType, data]);

  // useEffect(() => {
  //   if(eoa)
  //     setLoggedIn(true);
  //   else 
  //     setLoggedIn(false)
  // }, [eoa])

  console.log('demandType', demandType);

  const onApprove = useCallback(async () => {
    setLoading(true);
    let _error: any;
    if(demandType) {
      switch (demandType) {
        case 'Connection':
          try{
            await approveSessionProposal(data, stateResetter, wallet);
          } catch(err: any) {
            setError(err);
          } finally {
            setLoading(false);
          }
          break;
        case 'Transaction':
          let hash: any        
          try {
            hash = await onApproveRequest();
          } catch(err: any) {
            console.error(err);
            _error = err;
            setError(err);
          } finally {
            if(!hash && !_error)
              setError({code: '001' , message: `Failed to catch tx confirmation: please verify last tx on block exporer for confirmation`})
            else
              setTxResolved({success: !_error, hash}); // checar confirmação que a tx passou
            setLoading(false);
          }
          break;
        case 'Signature':
          try {
            hash = await onApproveRequest();
          } catch(err: any) {
            _error = err;
            setError(err);
          } finally {
            setLoading(false);
          }
          break;
      }
    } else {
      if(!vsa) {
        setError({ message: "no provider found" })
        setLoading(false)
        return;
      }
      let _error: any;
      let hash: `0x${string}` | undefined;
      const target = approveData?.data.targetAddress;
      const value = approveData?.data.value;
      console.log('onApprove: approveData', approveData);
      try {
        console.log('sending uo...');
        const res = await vsa.sendUserOperation({
          target,
          data: '0x',
          value
      });
      hash = res?.hash;
      console.log('hash', hash);
      } catch (err: any) {
        console.error(err);
        setError(err);
        _error = err;
      } finally {
        setLoading(false);
        setTxResolved({ success: !_error, hash });
        setApproveData(undefined);
      }
    }
    resetWalletUi();
  }, [
    demandType, onApproveProposal, onApproveRequest,
    setError, setLoading, setTxResolved, vsa
  ]);

  const onReject = useCallback(async () => {
    setLoading(true);
    if(demandType){
      switch (demandType) {
        case 'Connection':
          try {
            await onRejectProposal();
          } catch (err: any) {
            setError(err);
          } finally {
            setLoading(false);
          }
          break
        case 'Transaction':
        case 'Signature':
          try {
            await onRejectRequest();
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
    demandType, onRejectProposal, 
    onRejectRequest, setLoading, setError
  ]);

  const resetState = () => {
    setError(undefined);
    setTxResolved(undefined);
    setApproveData(undefined);
    setLoading(false);
  };

  return (
    <>
    {(demandType || approveData || error || txResolved) && 
      <ApproveDialog 
      approveData={approveData? approveData : demandType? {type: demandType, data} : undefined}
      onApprove={onApprove}
      onReject={onReject}
      onClose={resetState}
      loading={loading}
      error={error}
      txResolved={txResolved}
      />
    }
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
        { (eoa || address)
          ? <div className={styles.contentGridTemplate}> 
              <SideBar address={address?? vsaAddr ?? ''}
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
