'use client'

import { ApproveData } from '@/types';
import { useState , useEffect, useCallback } from 'react';
import { useAccount, useBalance, useNetwork, useWalletClient } from 'wagmi';
import { parseEther, formatEther, isAddress } from 'viem';
import { useSmartAccountAddress, usePair, useSmartAccount, useVennWallet } from '@/app/account/venn-provider';
import { getSdkError } from '@walletconnect/utils';
import { LinkIcon, SwapIcon, SendIcon, MessageIcon, FaucetIcon } from './icons';
import styles from './wallet.module.css';
import classNames from 'classnames';
import Tooltip from '@/components/common/tooltip/tooltip';
import { faucetDrip } from '@/utils/demo';
// const zeroAddress = "0x0000000000000000000000000000000000000000";

// interface QueryParams {
//     address: string;
// }

interface WalletProps {
  address?: string,
  setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>;
  openTransfer?: boolean,
  setOpenTransfer: any
  openConnect: boolean,
  setOpenConnect: any
  
}

interface ShowBalanceProps {
  address?: string,
  isSigner?: boolean,
  setShowFaucetMessage?: any
}



const FaucetMessageDialog = ({ setOpenMessage } : { setOpenMessage?: any}) => {
  return (
    <div className={styles.messageDialogBackdrop} onClick={() => setOpenMessage(false)}>
      <dialog className={styles.messageDialog} open>
        <div className={styles.messageDialogContent}>
          <MessageIcon />
          <span>You received a drip from our automatic faucet. Enjoy!</span>
          <button className={styles.messageCloseButton} onClick={() => setOpenMessage(false)}>
            OK
          </button>
        </div>
      </dialog>
    </div>
  )
}

const dust = BigInt(1e13)
const ShowBalance = ({address, isSigner, setShowFaucetMessage} : ShowBalanceProps) => {
    const [isClient, setIsClient] = useState(false);
    const { data: bal } = useBalance({ address: address as `0x${string}`, watch: true });
    const { chain } = useNetwork();

    useEffect(() => {
      if(address && bal?.value) {
        if(bal.value < dust)
          try {
            const fundAccount = async () => {
              const hash = await faucetDrip(address);
              console.log('funding tx', hash);
              setShowFaucetMessage(true);
            }
            fundAccount();
          } catch (error) {
            console.error('funding failed', error);
          }
      }
    }, [bal]);

    useEffect(() => {
      setIsClient(true);
    }, [])
  
    return (
      <div className={styles.yourBalanceContainer}>
        <span className={styles.profileSectionTitle}>
          {isClient&&isSigner&&'YOUR'} BALANCE
        </span>
        {isClient && <div>
          <div className={styles.balanceValueContainer}>
            <span className={styles.balanceValue}>
            {bal? parseFloat(formatEther(bal.value)).toFixed(4) : ''}
            </span>
            <span className={styles.balanceCurrency}>
              {bal && chain?.nativeCurrency.symbol}
            </span>
          </div>
        </div>}
      </div>
    )
}

const tooltipDisabledText = "Reserved for Smart Accounts";

const Buttons = ({setOpenTransfer, setOpenConnect, enabled}: {setOpenTransfer: any, setOpenConnect: any, enabled: boolean}) => {
  // const [style1, setStyle1] = useState(styles.balanceActionsContainerDisabled);
  // const [style2, setStyle2] = useState(styles.actionContainerDisabled)
  // useEffect(() => {
  //   if(enabled){
  //     // setStyle1(styles.balanceActionsContainer);
  //     setStyle2(styles.actionContainer)
  //   } else {
  //     // setStyle1(styles.balanceActionsContainerDisabled)
  //     setStyle2(styles.actionContainerDisabled)
  //   }
  // }, [enabled]);

  const onClickTransfer = () => {
    if(!enabled)
      return
    setOpenTransfer(true)
  }

  const onClickConnect = () => {
    if(!enabled)
      return
    setOpenConnect(true)
  }

  return (
    <div className={styles.balanceActionsContainer}>
            <div className={enabled ? styles.actionContainer : styles.actionContainerDisabled} onClick={onClickTransfer}>
              <Tooltip text={enabled ? 'Send' : tooltipDisabledText}><SendIcon enabled={enabled} /></Tooltip>
            </div>
            <div className={enabled ? styles.actionContainer : styles.actionContainerDisabled} onClick={onClickConnect}>
              <Tooltip text={enabled ? 'Send' : tooltipDisabledText}><LinkIcon enabled={enabled}/></Tooltip>
            </div>
            <div className={styles.actionContainer}>
              <a href='https://faucet.polygon.technology/' target='_blank'><Tooltip text="Faucet"><FaucetIcon /></Tooltip></a>
            </div>
    </div>
  )
}
  
const Transfer = ({ setApproveData } : { setApproveData: any }) => {
  const [value, setValue] = useState<number>();
  const [targetAddress, setTargetAddress] = useState<string>();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const vsaAddr = useSmartAccountAddress();
  const { data: bal } = useBalance({ address: vsaAddr });

  const handleValueChange = (e: any) => {
    let numValue = parseFloat(e.target.value);
    if(e.target.value === '')
      numValue = 0;
    if((numValue <= 0 || isNaN(numValue))){
      setDisabled(true);
      setValue(0);
    } else {
      setDisabled(false)
      setValue(numValue);
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
    const parsedValue = parseEther(value!.toString())
    if(bal?.value) {
      if(bal.value < parsedValue) {
        setDisabled(true);
        alert('not enough balance');
        return
      }
    }
    // setLoading(true);
    setApproveData({
      type: 'Transfer',
      data: {
        targetAddress,
        value: parsedValue
      }
    });
    // setOpenApproveDialog(true);
  }, [disabled, loading, targetAddress, setDisabled, setLoading]);

  return (
    <div>
      <span className={styles.priceInputLabel}>Value(ETH):</span>
      <div className={styles['priceInputContainer']}>
          <input 
          className={styles['priceInput']}
          placeholder='0.00'
          type='number'
          min='0'
          onChange={(e) => handleValueChange(e)}
          />
      </div>
      <span className={styles.priceInputLabel}>Address:</span>
      <div className={styles['priceInputContainer']}>
          <input 
          className={styles['priceInput']}
          placeholder='0x...'
          type='string'
          onChange={(e) => handleAddressChange(e)}
          />
      </div>
      <div className={disabled ? styles.primaryButtonDisabled : styles.primaryButton} onClick={() => onTransfer()}>
        Transfer
      </div>
    </div>
  )
}

const Connect = () => {
  const [uri, setUri] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const pair = usePair();
  // console.log('pair', pair);
  console.log('connect loading', loading)

  useEffect(() => {
    if(uri.length)
      setDisabled(false)
    else
      setDisabled(true);
  }, [uri]);


  const onConnect = async () => {
    if(disabled || loading)
      return
    if(pair){
      setLoading(true);
      try {
        console.log('pair')
        await pair({ uri, activatePairing: true });
      } catch (error: any) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div>
      <div className={styles['priceInputContainer']}>
          <input 
          className={styles['priceInput']}
          placeholder='Enter Uri'
          type='string'
          onChange={(e) => setUri(e.target.value)}
          />
      </div>
      <div className={(disabled || loading) ? styles.primaryButtonDisabled : styles.primaryButton} onClick={() => onConnect()}>
        Connect
      </div>
    </div>
  )
}

const Sessions = ({setOpenConnect} : {setOpenConnect: any}) => {
  const [activeSessions, setActiveSessions] = useState<any>();
  const [updater, setUpdater] =  useState(false);
  const [disconect, setDisconect] = useState<any>();
  const { wallet, updater: walletUpdater } = useVennWallet();

  useEffect(() => {
    setActiveSessions(wallet?.getActiveSessions());
  }, [wallet, updater, walletUpdater]);

  const onClick = async (key: any) => {
    if(!wallet) return
    if(disconect === key) {
      let error: any;
      try {
        await wallet.disconnectSession({
          topic: activeSessions[key].topic,
          reason: getSdkError('USER_DISCONNECTED')
        });
      } catch(err) {
        console.error(err);
        error = err;
      }
      if(!error)
        setOpenConnect(false);
      setUpdater(!updater);
    } else {
      setDisconect(key)
      setTimeout(() => {
        setDisconect(undefined)
      }, 3000);
    }
  }
  console.log('activeSessions', activeSessions);
  
  /// A LISTA DO MAP ABAIXO NAO TA ATUALIZANDO QDO DESCONECTA
  return (
    <div className={styles.activeSessionsContainer}>
      <div className={styles.profileSectionTitle}>ACTIVE SESSIONS</div>
      {activeSessions
        ? Object.keys(activeSessions).map((key) => {
            return (
              <div className={styles.sessions} key={key} onClick={() => onClick(key)}>
                {(disconect === key) ? "Disconnect" : activeSessions[key].peer.metadata.name}
              </div>
            )
          })
        : ''
      }
    </div>
  )
}

const Back = ({
  setOpenTransfer,
  setOpenConnect
} : {
  setOpenTransfer?: any,
  setOpenConnect?: any
}) => {
  
  const back = useCallback(() => {
    if(setOpenConnect)
      setOpenConnect(false);
    else if(setOpenTransfer)
      setOpenTransfer(false);
  },[setOpenConnect, setOpenTransfer]);

  return (
    <div className={styles.secondaryButton} onClick={back}>
      Back
    </div>
  )
}


export default function Wallet({
  address, setApproveData, openTransfer, setOpenTransfer, openConnect, setOpenConnect
} : WalletProps) {

  const [showFaucetMessage, setShowFaucetMessage] = useState(false);
  // const [disableActions, setDisalbleAction] = useState<boolean>();
  const eoa = useAccount();
  const vsaAddr = useSmartAccountAddress();
  
  return (
    <>
    {showFaucetMessage && <FaucetMessageDialog setOpenMessage={setShowFaucetMessage} />}
    <div>
        <ShowBalance 
          address={address?? eoa.address?? vsaAddr} isSigner={address? (address==eoa.address) || (address==vsaAddr) : true } 
          setShowFaucetMessage={setShowFaucetMessage}
        />
        {!openConnect && !openTransfer && 
        <Buttons 
        setOpenConnect={setOpenConnect} 
        setOpenTransfer={setOpenTransfer} 
        enabled={address? (address==vsaAddr) : vsaAddr? true : false} 
        // enabled={true}
        />
        }
        {openConnect &&
        <>
          <Connect />
          <Back setOpenConnect={setOpenConnect} />
          <Sessions setOpenConnect={setOpenConnect} />
        </>
        }
        {openTransfer &&
        <>
        <Transfer setApproveData={setApproveData}/>
        <Back setOpenTransfer={setOpenTransfer} />
        </>
        }
    </div>
    </>
  )
}