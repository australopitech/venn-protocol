'use client'
import classNames from 'classnames';
import styles from './navbar.module.css';
import { useState, useEffect, useCallback } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { usePathname } from 'next/navigation';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { activeNetwork, useSmartAccount, useVsaUpdate} from '@/app/account/venn-provider';
import { compactString } from '@/utils/utils';
import { LoadingDots } from '../loading/loading';
import { source_code_pro } from '@/app/fonts';
import { WalletIcon, LogOutIcon, AtentionIcon } from './icons';
import { motion } from "framer-motion";

interface ConnectButtonProps {
    connectText?: string;
    // page?: string
}


export default function ConnectButton ({connectText} : ConnectButtonProps) {
    const { address: vsa } = useSmartAccount();
    const eoa = useAccount();
    const { disconnect } = useDisconnect();
    const { openConnectModal } = useConnectModal();
    const path = usePathname();
    const [showDisconnect, setShowDisconnect] = useState(false);
    const [disconnectStlye, setDisconnectStyle] = useState<any>(styles.disconnectButton);
    const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);
    const vsaUpdate = useVsaUpdate();
    const [isClient, setIsClient] = useState(false);
    const compactAddress = compactString(vsa ?? eoa.address);
    const { chain } = useNetwork();
    const { switchNetwork, error } = useSwitchNetwork();
  
    useEffect(() => {
      setTimeout(() => {
        setIsClient(true)
      }, 2000);
    },[])
  
    const onDisconnect = useCallback(() => {  
      if(
        !path.includes("dashboard") &&
        !showDisconnect
        ){  
          setDisconnectStyle(styles.primaryButton)
          setShowDisconnect(true);
          setTimeout(() => {
            setShowDisconnect(false);
            setDisconnectStyle(styles.disconnectButton)
          }, 5000);
        } else {
          disconnect();
          if(vsaUpdate) vsaUpdate();
        }
    }, [showDisconnect, setShowDisconnect, vsaUpdate]);
  
    const onSwitchNetwork = () => {
      if(!showSwitchNetwork) {
        setShowSwitchNetwork(true);
        setTimeout(() => {
          setShowSwitchNetwork(false);
        }, 5000);
      } else {
        if(switchNetwork) switchNetwork(activeNetwork.id)
        else {
          if(error) alert(error.message)
          else alert('Something went wrong! Please use your wallet to switch to Sepolia testnet.')
        }
      }
    }
  
    if (isClient && eoa.isConnected) {
      return (
        chain?.id === activeNetwork.id 
          ? <div className={classNames(disconnectStlye, source_code_pro.className)} onClick={() => disconnect()}>
              {/* {(path.includes("dashboard") || showDisconnect) ? " LOG OUT" : compactAddress} */}
              LOG OUT
              <LogOutIcon/>
            </div>
          : <div className={classNames(styles.wrongNetwork, source_code_pro.className)} onClick={() => onSwitchNetwork()}>
                {showSwitchNetwork
                 ? "SWITCH NETWORKS" 
                 : "WRONG NETWORK"
                }
            </div>
      );
    }
    else if (isClient && openConnectModal) return (
      <div className={classNames(styles.primaryButton, source_code_pro.className)} onClick={() => openConnectModal()}>
        {connectText? connectText : 'LOG IN'}
        <WalletIcon/>
      </div>
    )
    else return <div className={styles.primaryButton}> <LoadingDots /> </div>
  }
  