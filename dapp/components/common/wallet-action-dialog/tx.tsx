'use client'
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import styles from './wallet-action-dialog.module.css';
import { CloseIcon } from './graphics';
import { useGasEstimation } from '@/hooks/tx-data';
import { ApproveData } from '@/types';
import { formatUnits } from 'viem';

interface TxRequestDialogProps {
    vsa?: string,
    close: any;
    sessionRequest?: Web3WalletTypes.SessionRequest
    // isloading: boolean;
    onApprove: any;
    onReject: any;
}

const mockRequest = {
    id: 1718045834967356,
    params: {
        chainId: "eip155:11155111",
        request: {
            method: "eth_sendTransaction",
            params: [{
                data: "0xd0e30db0",
                from: "0xb0a2ddf528718f22258839dba892a0828c6705a0",
                gas: "0xb16a",
                value: "0x38d7ea4c68000"
            }]
        },
    },
    topic: "47ac37eb5430a5eef9dfdbbd6f0167640c322a93fc94507165fdbadf254e1e7d",
    verifyContext: {
        verified: {
            origin: "https://app.uniswap.org",
            validation: "UNKNOWN"
        }
    }
}

export function TxRequestDialog ({
    vsa,
    close,
    sessionRequest,
    onApprove,
    onReject
} : TxRequestDialogProps) {
    // const [blocker, setBlocker] = useState(false);
    const decimals = 18;
    const approveData = { type: 'Transaction', data: sessionRequest } as ApproveData;
    const { data: gas, gasFee, isLoading, error: gasError } = useGasEstimation({ 
        approveData
    });

    const value = BigInt(sessionRequest?.params.request.params[0].value ?? 0);


    const onClose = () => {
        onReject();
        close();
    }

    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <div className={styles.dialogContent}>
                    <div className={styles.closeIcon} onClick={onClose}>
                        <CloseIcon/>
                    </div>
                    <div className={styles.title}>Transaction Request</div>
                    <div className={styles.description}>
                        Approve this transaction?
                    </div>
                    <div className={styles.txMetadataContainer}>
                        <p>
                            - Origin:<br/>
                            <span className={styles.txMetadata}>
                                {sessionRequest?.verifyContext.verified.origin.slice(8)}
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
                           : (value !== undefined && gas && gasFee)
                             ? <>
                                <span className={styles.txMetadata}>{formatUnits(value, decimals)}</span> + gas fee = <span className={styles.txMetadata}>{formatUnits(value + (gas*gasFee), decimals)}</span> ETH
                               </>
                             : null
                          }
                        </p>
                    </div>
                    <div className={styles.twoButtonsContainer}>
                        <div className={styles.cancelButton} onClick={onReject}>
                            cancel
                        </div>
                        <div className={styles.dialogButton} onClick={onApprove}>
                            approve
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface TxSuccessProps {
    close: any;
    hash?: string
    address?: string
}

export function TxSuccess ({ hash, address, close } : TxSuccessProps) {
    // const { chain } = useNetwork();

    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <div className={styles.dialogContent}>
                    <div className={styles.closeIcon} onClick={close}>
                        <CloseIcon/>
                    </div>
                    <div className={styles.title}>
                        Transaction Sucessfull!
                    </div>
                    {hash
                     ? <div className={styles.description}>
                            <a href={`https://sepolia.etherscan.io/tx/${hash}`} 
                            target='_blank'
                            className={styles.link}
                            >
                            View it on block explorer.
                            </a>
                        </div>
                     : <div className={styles.description}>
                            Transaction id could not be retrieved.
                            Confirm your transaction was included by checking the last entry <a href={`https://sepolia.etherscan.io/address/${address}`}>here</a>.
                        </div>
                    }
                    <div className={styles.cancelButton} onClick={close}>
                        close
                    </div>
                </div>
            </div>
        </div>
    )
}