'use client'
import { ApproveData, TxInputs } from '@/types';
import styles from './wallet-action-dialog.module.css';
import { CloseIcon } from './graphics';
import { useGasEstimation } from '@/hooks/tx-data';
import { formatUnits } from 'viem';

interface InternalTxDialogProps {
    close: () => void,
    approveData: ApproveData,
    onConfirm: () => Promise<void>
}

const decimals = 18;

export default function InternalTxDialog ( {
    close,
    approveData,
    onConfirm
} : InternalTxDialogProps) {

    const { data: gas, gasFee, isLoading, error: gasError } = useGasEstimation({ 
        approveData
    });
    
    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <div className={styles.dialogContent}>
                    <div className={styles.closeIcon} onClick={close}>
                        <CloseIcon/>
                    </div>
                    <div className={styles.title}>Confirm Transaction</div>
                    <div className={styles.description}>
                        Do you want to send this transaction?
                    </div>
                    <div className={styles.txMetadataContainer}>
                        <p>
                            -Method:<br/>
                            <span className={styles.txMetadata}>
                                {approveData.type === 'Internal' ? approveData.data.method : ''}
                            </span>
                        </p>
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
                            : (approveData.type === 'Internal' && gas && gasFee)
                            ? <>
                                <span className={styles.txMetadata}>{formatUnits(approveData.data.value ?? 0n, decimals)}</span> + gas fee = <span className={styles.txMetadata}>{formatUnits(approveData.data.value ?? 0n + (gas*gasFee), decimals)}</span> ETH
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
                </div>
            </div>  
        </div>
    )

}