'use client'
import styles from './wallet-actions.module.css';
import { SendIcon, ConnectIcon, FaucetIcon, CloseIcon } from './graphics';
import { useState, useCallback, useEffect } from 'react';
import { useOpenConnect, usePair, useSmartAccountAddress } from '@/app/account/venn-provider';
import { isAddress, parseEther } from 'viem';
import { ApproveData } from '@/types';
import { LoadingDots } from '@/components/common/loading/loading';
import classNames from 'classnames';


interface WalletActionProps {
    isVsa: boolean;
    balance?: bigint;
    setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>;
}

export default function WalletActions ({ isVsa, balance, setApproveData } : WalletActionProps) {
    const [openSend, setOpenSend] = useState(false);
    // const [openConnect, setOpenConnect] = useState(false);
    const openConnect = useOpenConnect();

    const onOpenActionDialog = () => {
        if(openConnect)
            openConnect(true);
    }

    return (
        <>
        {openSend && <SendDialog setOpen={setOpenSend} balance={balance} setApproveData={setApproveData} />}
        {/* {openConnect && <ConnectDialog setOpen={setOpenConnect}/>} */}
        <div className={styles.buttons}>
            <div className={styles.buttonContainer}>
                <div className={styles.button} onClick={() => setOpenSend(true)}>
                    <span className={styles.buttonText}>send</span>
                    <div className={styles.icon}><SendIcon/></div>
                </div>
                <span className={styles.buttonDescription}>send</span>                    
            </div>
            <div className={styles.buttonContainer}>
                <a href='https://www.alchemy.com/faucets/ethereum-sepolia' target='_blank' style={{ width: '100%'}}>
                    <div className={styles.button}>
                        <span className={styles.buttonText}>faucet</span>
                        <div className={styles.icon}><FaucetIcon/></div>
                    </div>
                </a>
                <span className={styles.buttonDescription}>faucet</span>                    
            </div>
            <div className={styles.buttonContainer}>
                <div className={classNames(styles.button, !isVsa ? styles.disabled : '')} onClick={onOpenActionDialog}>
                    <span className={styles.buttonText}>connect</span>
                    <div className={styles.icon}><ConnectIcon/></div>
                </div>
                <span className={styles.buttonDescription}>connect</span>
            </div>
        </div>
        </>
    )
}

function SendDialog ({
        setOpen, 
        balance, 
        setApproveData 
    } : { 
        setOpen : any, 
        balance?: bigint, 
        setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>
    }) {
    const [amount, setAmount] = useState<number>();
    const [targetAddress, setTargetAddress] = useState<string>();
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const vsa = useSmartAccountAddress();

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

    const onTransfer = useCallback(async () => {
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
        setTimeout(() => {
            setApproveData({
                type: 'Transfer',
                data: {
                  targetAddress,
                  value: parsedValue
                }
              });
              setOpen(false);
        }, 3000);
        
        // setOpenApproveDialog(true);
      }, [disabled, loading, targetAddress, setDisabled, setLoading]);

    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <div className={styles.dialogContent}>
                    <div className={styles.closeIcon} onClick={() => setOpen(false)}>
                        <CloseIcon/>
                    </div>
                    <div className={styles.title}>Send ETH</div>
                    <div className={styles.inputContainer}>
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
                        onClick={onTransfer}
                        >
                            {loading
                             ? <LoadingDots/>
                             : 'send'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ConnectDialog ({ setOpen } : { setOpen : any }) {
    const [uri, setUri] = useState<string>('');
    const [disabled, setDisabled] = useState(true);
    const { pair, isLoading } = usePair();

    useEffect(() => {
        if(uri.length)
            setDisabled(false)
        else
            setDisabled(true)
    }, [uri]);

    const onConnect = async () => {
        if(disabled || isLoading)
          return
        if(pair){
          // setLoading(true);
          try {
            console.log('pair')
            await pair({ uri, activatePairing: true });
            setTimeout(() => {
                setOpen(false)
            }, 2000);
          } catch (error: any) {
            alert(error.message);
          }
        }
      }
    

    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <div className={styles.dialogContent}>
                    <div className={styles.closeIcon} onClick={() => setOpen(false)}>
                        <CloseIcon/>
                    </div>
                    <div className={styles.title}>Connect</div>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputGroup}>
                            Link:
                            <input className={styles.input}
                            type='string'
                            placeholder='PASTE IT HERE'
                            onChange={(e) => setUri(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={classNames(styles.dialogButton, disabled ? styles.disabled : '')}
                    onClick={onConnect}
                    >
                        {isLoading
                         ? <LoadingDots/>
                         : 'connect'}
                    </div>
                </div>
            </div>
        </div>
    )
}