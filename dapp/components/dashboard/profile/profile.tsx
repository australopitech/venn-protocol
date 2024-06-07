import styles from './profile.module.css';
import { FaucetIcon, SendIcon, ConnectIcon, CopyIcon, CheckIcon } from './graphics';
import { compactString } from '@/utils/utils';
import { ApproveData, nftViewContext } from '@/types';
import { copyAddress } from '@/utils/utils';
import { useCallback, useState } from 'react';
import { Tooltip } from '@/components/common/tooltip/tooltip';
import { LoadingDots } from '../dashboard-layout/dashboard-layout';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingContent } from '@/components/common/loading/loading';

export interface ProfileProps {
    address?: string;
    isConnecting?: boolean;
    isSigner: boolean;
    // nftsContext: nftViewContext;
    // setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>;
    // openTransfer?: boolean,
    // setOpenTransfer: any
    // openConnect: boolean,
    // setOpenConnect: any
}

export default function Profile ({
    address,
    isConnecting,
    isSigner
} : ProfileProps) {
    

    return (
        <div className={styles.profile}>
            <div className={styles.avatar}></div>
            {isConnecting
             ? <div style={{ height: 'var(--step-5)', width: '90%'}}><LoadingContent/></div>
             : <div className={styles.address}>
                <span className={styles.info}>{compactString(address)}</span>
                <Copy address={address}/>
            </div>}
            {(isConnecting || isSigner) &&
                <>
                <span className={styles.yourBalance}>your balance</span>
                {isConnecting
                 ? <div style={{height: 'var(--step-5)', width: '60%'}}><LoadingContent/></div>
                 : <span className={styles.info}>1.000 ETH</span>}
                {isSigner &&
                    <div className={styles.buttons}>
                        <div className={styles.buttonContainer}>
                            <div className={styles.button}>
                                <span className={styles.buttonText}>send</span>
                                <div className={styles.icon}><SendIcon/></div>
                            </div>
                            <span className={styles.buttonDescription}>send</span>                    
                        </div>
                        <div className={styles.buttonContainer}>
                            <div className={styles.button}>
                                <span className={styles.buttonText}>connect</span>
                                <div className={styles.icon}><ConnectIcon/></div>
                            </div>
                            <span className={styles.buttonDescription}>connect</span>
                        </div>
                        <div className={styles.buttonContainer}>
                            <div className={styles.button}>
                                <span className={styles.buttonText}>faucet</span>
                                <div className={styles.icon}><FaucetIcon/></div>
                            </div>
                            <span className={styles.buttonDescription}>faucet</span>                    
                        </div>
                    </div>
                }
                </>
            }
        </div>
    )
}

const copyIconVariant = {
    initial: { width: 24, height: 24 },
    exit: { width: 0 , height: 0 },
}

function Copy ({ address } : { address? : string }) {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(() => {
        if(copied)
            return
        copyAddress(address);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 5000);
    }, [])

    return (
        <>
        <AnimatePresence mode='wait'>
        {copied
         ? <motion.div style={{ width: '24px', height: '24px'}}
            onClick={copy}
            variants={copyIconVariant}
            initial='initial'
            exit='exit'
            transition={{ duration: 1 }}
            >
                <CheckIcon/>
            </motion.div>
         : <motion.div style={{ width: '24px', height: '24px', cursor: 'pointer'}}
            onClick={copy}
            variants={copyIconVariant}
            initial='initial'
            exit='exit'
            transition={{ duration: 1 }}
            >
                <CopyIcon/>
            </motion.div>
        }
        </AnimatePresence>
        </>
    )
}