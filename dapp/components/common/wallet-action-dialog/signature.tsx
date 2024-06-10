'use client'
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import styles from './wallet-action-dialog.module.css';
import { CloseIcon } from './graphics';

interface SignatureDialogProps {
    close: any;
    sessionRequest?: Web3WalletTypes.SessionRequest;
    onApprove: () => Promise<void>;
    onReject:  () => Promise<void>;
}

export default function SignatureDialog ({
    close,
    sessionRequest,
    onApprove,
    onReject
} : SignatureDialogProps) {

    const onClose = async () => {
        await onReject();
        close();
    }

    return (
     <div className={styles.dialogBackdrop}>
        <div className={styles.dialog}>
        <div className={styles.dialogContent}>
            <div className={styles.closeIcon} onClick={onClose}>
                <CloseIcon/>
            </div>
            <div className={styles.title}>Signature Request</div>
            <div className={styles.description}>
                Sign message from {sessionRequest?.verifyContext.verified.origin}?
            </div>
            <div className={styles.twoButtonsContainer}>
                <div className={styles.cancelButton} onClick={onReject}>
                    cancel
                </div>
                <div className={styles.dialogButton} onClick={onApprove}>
                    sign
                </div>
            </div>
        </div>
    </div>
</div>
)
}