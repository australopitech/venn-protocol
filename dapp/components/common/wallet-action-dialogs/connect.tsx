'use client'
import classNames from 'classnames';
import { LoadingDots } from '../loading/loading';
import { CloseIcon, TurnOffIcon } from './graphics';
import styles from './wallet-action-dialogs.module.css';
import { useState, useEffect } from 'react';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { useActiveSessions } from '@/app/account/venn-provider';

interface ConnectDialogProps {
    close: any;
    sessionProposal?: Web3WalletTypes.SessionProposal
    isLoading: boolean;
    onConnect: any;
    onApprove: any;
    onReject: any;
}

export function ConnectDialog ({ 
    close,
    isLoading,
    sessionProposal,
    onConnect,
    onApprove,
    onReject
} : ConnectDialogProps) {
    
    // const [approveModal, setApproveModal] = useState(false);
    const onClose = () => {
        if(sessionProposal)
            onReject();
        close();
    }

    console.log('session proposal', sessionProposal);

    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <div className={styles.dialogContent}>
                    <div className={styles.closeIcon} onClick={onClose}>
                        <CloseIcon/>
                    </div>
                    <div className={styles.title}>Connect</div>
                   {sessionProposal
                    ? <ConnectApprove 
                        proposer={sessionProposal.params.proposer.metadata.url}
                        onApprove={onApprove}
                        onReject={onReject}
                        />
                    : <ConnectInput
                        isLoading={isLoading}
                        onConnect={onConnect}
                    />
                   } 
                </div>
            </div>
        </div>
    )
}

const ConnectInput = ({ 
    isLoading,
    onConnect
} : { 
    onConnect: any,
    isLoading: boolean
}) => {
    
    const [uri, setUri] = useState<string>('');
    const [disabled, setDisabled] = useState(true);
    const { activeSessions, disconnect } = useActiveSessions();

    console.log('activeSessions', activeSessions);

    useEffect(() => {
        if(uri.length)
            setDisabled(false)
        else
            setDisabled(true)
    }, [uri]);

    return (
        <>
        <div className={classNames(styles.inputContainer, isLoading ? styles.loading : '')}>
            <div className={styles.inputGroup}>
                Link:
                    <input className={styles.input}
                    type='string'
                    placeholder='PASTE IT HERE'
                    onChange={(e) => setUri(e.target.value)}
                    disabled={isLoading}
                    />
            </div>
        </div>
        <div className={classNames(styles.dialogButton, (disabled || isLoading) ? styles.disabled : '')}
        onClick={() => onConnect(uri)}
        >
            {isLoading
             ? <LoadingDots/>
             : 'connect'}
        </div>
        {(activeSessions && Object.keys(activeSessions).length > 0) &&
        <ActiveSessions activeSessions={activeSessions} disconnect={disconnect}/>
        }
        </>
    )
}

const ActiveSessions = ({ activeSessions, disconnect } : { activeSessions?: any, disconnect: any }) => {
    const [selected, setSelected] = useState<string>();

    const onClick = async (key: string) => {
        if(selected === key) {
            await disconnect(activeSessions[key].topic);
        } else {
            setSelected(key);
            setTimeout(() => {
                setSelected(undefined);
            }, 3000);
        }
    }

    return (
        <div style={{ width: '100%'}}>
            {activeSessions && 
            <div className={styles.inputGroup}>
                Active Sessions:
                <div className={styles.sessionsContainer}>
                    {Object.keys(activeSessions).map((key) => {
                        return (
                            <div className={styles.session} onClick={() => onClick(key)}>
                                {(selected === key) ? "Disconnect" : activeSessions[key].peer.metadata.name}
                                <TurnOffIcon/>
                            </div>
                        )
                    })}
                </div>  
            </div>}
        </div>
    )
}

const ConnectApprove = ({
    proposer,
    onApprove,
    onReject
} : {
    proposer?: string,
    onApprove: any,
    onReject: any
}) => {

    return (
        <>
        <div>
            Connect to {proposer}?
        </div>
        <div className={styles.twoButtonsContainer}>
            <div className={styles.cancelButton}
            onClick={onReject}
            >
                cancel
            </div>
            <div className={styles.dialogButton}
            onClick={onApprove}
            >
                approve
            </div>
        </div>
        </>
    )
}