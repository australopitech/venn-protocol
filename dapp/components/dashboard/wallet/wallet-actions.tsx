'use client'
import styles from './wallet-actions.module.css';
import { SendIcon, ConnectIcon, FaucetIcon, CloseIcon } from './graphics';
import React, { useState, useCallback, useEffect } from 'react';
import { useOpenConnect, usePair, useSmartAccount, useSmartAccountAddress } from '@/app/account/venn-provider';
import { formatUnits, isAddress, parseEther } from 'viem';
import { ApproveData, TxInputs } from '@/types';
import { LoadingDots } from '@/components/common/loading/loading';
import classNames from 'classnames';
import { useGasEstimation } from '@/hooks/tx-data';
import { compactString } from '@/utils/utils';
import { resolveApprovalInternal } from '@/app/account/wallet';
import ProcessingDialog from '@/components/common/wallet-action-dialog/processing';
import ErrorDialog from '@/components/common/wallet-action-dialog/error';
import { TxSuccess } from '@/components/common/wallet-action-dialog/tx';
import { SendDialog } from '@/components/common/wallet-action-dialog/send';


interface WalletActionProps {
    address?: string,
    isVsa: boolean;
    balance?: bigint;
    setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>;
}

export default function WalletActions ({ address, isVsa, balance, setApproveData } : WalletActionProps) {
    const [openSend, setOpenSend] = useState(false);
    // const [openConnect, setOpenConnect] = useState(false);
    const openConnect = useOpenConnect();
    const [error, setError] = useState<any>();
    const [hash, setHash] = useState<string>();
    const [isProcessing, setIsProcessing] = useState(false);

    const onOpenActionDialog = () => {
        if(openConnect)
            openConnect(true);
    }

    return (
        <>
        {openSend && 
        <SendDialog 
        close={() => setOpenSend(false)} 
        balance={balance} 
        setError={setError}
        setHash={setHash}
        setIsProcessing={setIsProcessing}        
        />}
        {isProcessing
         ? <ProcessingDialog/>
         : error
          ? <ErrorDialog close={() => setError(false)} message={error.message}/>
          : hash
           ? <TxSuccess close={() => setHash(undefined)} hash={hash} address={address}/>
           :''
        }
        <div className={styles.buttons}>
            {isVsa &&
            <>
            <div className={styles.buttonContainer}>
                <div className={styles.button} onClick={() => setOpenSend(true)}>
                    <span className={styles.buttonText}>send</span>
                    <div className={styles.icon}><SendIcon/></div>
                </div>
                <span className={styles.buttonDescription}>send</span>                    
            </div>
            <div className={styles.buttonContainer}>
                <div className={classNames(styles.button, !isVsa ? styles.disabled : '')} onClick={onOpenActionDialog}>
                    <span className={styles.buttonText}>connect</span>
                    <div className={styles.icon}><ConnectIcon/></div>
                </div>
                <span className={styles.buttonDescription}>connect</span>
            </div>
            </>}
            <div className={styles.buttonContainer}>
                <a href='https://www.alchemy.com/faucets/ethereum-sepolia' target='_blank' style={{ width: '100%'}}>
                    <div className={styles.button}>
                        <span className={styles.buttonText}>faucet</span>
                        <div className={styles.icon}><FaucetIcon/></div>
                    </div>
                </a>
                <span className={styles.buttonDescription}>faucet</span>                    
            </div>
        </div>
        </>
    )
}

