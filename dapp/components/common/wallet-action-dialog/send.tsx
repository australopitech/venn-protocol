'use client'
import styles from './wallet-action-dialog.module.css';
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
import { CloseIcon } from './graphics';


export function SendDialog ({
    close, 
    balance, 
    setError,
    setHash,
    setIsProcessing
} : { 
    close : () => void, 
    balance?: bigint, 
    setError: React.Dispatch<React.SetStateAction<any>>,
    setHash: React.Dispatch<React.SetStateAction<string | undefined>>
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>
}) {
const [amount, setAmount] = useState<number>();
const [targetAddress, setTargetAddress] = useState<string>();
const [disabled, setDisabled] = useState(true);
const [loading, setLoading] = useState(false);
// const vsa = useSmartAccountAddress();
const [approve, setApprove] = useState(false);
const { provider } = useSmartAccount();

console.log('targetAddress', targetAddress)

const handleAmountChange = (e: any) => {
    let numValue = parseFloat(e.target.value);
    if(e.target.value === '')
      numValue = 0;
    if((numValue <= 0 || isNaN(numValue))){
      setDisabled(true);
      setAmount(0);
    } else {
      setDisabled(false)
      setAmount(numValue);
    }
  }

const handleAddressChange = (e: any) => {
    let value = e.target.value;
    if(!value || !value.length)
      setDisabled(true);
    else {
      setDisabled(false);
      setTargetAddress(value);
    }
}

const onSend = useCallback(async () => {
    if(disabled || loading)
      return
    if(!isAddress(targetAddress!)){
      setDisabled(true);
      return
    }
    const parsedValue = parseEther(amount!.toString())
    if(balance) {
      if(balance < parsedValue) {
        setDisabled(true);
        alert('not enough balance');
        return
      }
    }
    setLoading(true);
    setApprove(true);
    
    // setOpenApproveDialog(true);
}, [disabled, loading, targetAddress, setDisabled, setLoading]);

const onConfirm = async () => {
    setIsProcessing(true);
    const data = {
        targetAddress,
        value: parseEther(amount!.toString())
    }
    if(!provider) {
        close();
        setError({ message: 'missing provider' });
        return
    }
    const { hash, error } = await resolveApprovalInternal(data, provider);
    setError(error);
    setHash(hash);
    setIsProcessing(false);
    close();
}

return (
    <div className={styles.dialogBackdrop}>
        <div className={styles.dialog}>
            <div className={styles.dialogContent}>
                <div className={styles.closeIcon} onClick={close}>
                    <CloseIcon/>
                </div>
                <div className={styles.title}>Send ETH</div>
                {approve
                 ? <SendConfirm 
                    amount={amount!} 
                    to={targetAddress!}
                    close={close}
                    onConfirm={onConfirm}
                    />
                 : <div className={styles.inputContainer}>
                        <div className={styles.inputGroup}>
                            Amount:
                            <div className={styles.inputBox}>
                                <input className={styles.input}
                                type='number'
                                min={0}
                                placeholder='0.00'
                                onChange={(e) => handleAmountChange(e)}
                                />
                                <span className={styles.unit}>ETH</span>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            To:
                            <input className={styles.input}
                            type='string'
                            placeholder='0x...'
                            onChange={(e) => handleAddressChange(e)}
                            />
                        </div>
                        <div className={classNames(styles.dialogButton, disabled ? styles.disabled : '')}
                        onClick={onSend}
                        >
                            {loading
                            ? <LoadingDots/>
                            : 'send'}
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
)
}

interface SendConfirmProps {
amount: number;
to: string;
close: () => void
onConfirm: () => void
}

const decimals = 18

function SendConfirm ({
amount,
to,
close,
onConfirm
} : SendConfirmProps) {
const approveData = {
    type: 'Transfer',
    data: {
        targetAddress: to,
        value: parseEther(amount.toString())
    } as TxInputs
} as ApproveData;

const { data: gas, gasFee, isLoading, error: gasError } = useGasEstimation({ 
    approveData
});

return (
    <>
    <div className={styles.description}>
        Send {amount} ETH to {compactString(to)}?
    </div>
    <div className={styles.txMetadataContainer}>
        <p>
            -Gas Fee: <br/>
            <span className={styles.txMetadata}>
                {isLoading? ' loading...' : (gas && gasFee)? ' ' + formatUnits(gas * gasFee, decimals) : ` error fetching gas: ${gasError?.message}`}
            </span>
            {(gas && gasFee) ? " ETH" : ""}
        </p>
        <p>
            - Total Value:<br/>
            {isLoading
             ? <span className={styles.txMetadata}>loading...</span>
             : (amount !== undefined && gas && gasFee)
              ? <>
                <span className={styles.txMetadata}>{amount}</span> + gas fee = <span className={styles.txMetadata}>{formatUnits(parseEther(amount.toString()) + (gas*gasFee), decimals)}</span> ETH
                </>
              : null
            }
        </p>            
    </div>
    <div className={styles.twoButtonsContainer}>
        <div className={styles.cancelButton} onClick={close}>
            cancel
        </div>
        <div className={styles.dialogButton} onClick={onConfirm}>
            confirm
        </div>
    </div>
    </>
)
}