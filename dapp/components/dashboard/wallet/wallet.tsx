'use client'

import { ApproveData } from '@/types';
import { useState , useEffect, useCallback } from 'react';
import { useAccount, useBalance, useNetwork, useWalletClient } from 'wagmi';
import { parseEther, formatEther, isAddress } from 'viem';
import { useSmartAccountAddress, usePair, useSmartAccount, useVennWallet } from '@/app/account/venn-provider';
import { getSdkError } from '@walletconnect/utils';
import styles from './wallet.module.css';

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
}

const SendIcon =  ({enabled} : {enabled: boolean}) => { //3C4252
    return (
      <div className={styles.sendIcon}>
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 28 28"
          xmlSpace="preserve"
          width="20"
          height="20"
          opacity={enabled ? 1 : 0.2}
          cursor={enabled? "pointer" : "not-allowed"}
        >
          <g>
            <g>
              <path
                d="M27.352 12.957 1.697 0.129C0.639 -0.4 -0.443 0.801 0.192 1.798l7.765 12.202L0.192 26.202c-0.635 0.998 0.447 2.198 1.505 1.669l25.655 -12.828c0.86 -0.43 0.86 -1.656 0 -2.086zM4.42 23.902 10.323 14.626a1.166 1.166 0 0 0 0 -1.252L4.42 4.098l19.803 9.902L4.42 23.902z"
                stroke="#4f4f4fe6"
                fill="#4f4f4fe6"
              />
            </g>
          </g>
        </svg>
      </div>
    )
  }
  
  const SwapIcon =  ({enabled} : {enabled: boolean}) => {
    return (
      <svg 
        version="1.1" 
        id="Layer_1" 
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        x="0px" 
        y="0px" 
        viewBox="0 0 32 32" 
        xmlSpace="preserve" 
        width="28px" 
        height="28px"
        opacity={enabled? 1 : 0.2}
        cursor={enabled? "pointer" : "not-allowed"}
      >
        <g>
          <g>
            <g>
              <path
                d="M4.552 13.333H20c0.736 0 1.333 -0.597 1.333 -1.333 0 -0.736 -0.597 -1.333 -1.333 -1.333H4.552l3.057 -3.057c0.521 -0.521 0.521 -1.365 0 -1.886 -0.521 -0.521 -1.365 -0.521 -1.886 0L0.391 11.057c-0.031 0.031 -0.06 0.064 -0.088 0.098 -0.013 0.015 -0.024 0.032 -0.035 0.047 -0.014 0.019 -0.029 0.038 -0.042 0.057 -0.013 0.019 -0.024 0.039 -0.035 0.058 -0.011 0.018 -0.022 0.035 -0.032 0.054 -0.011 0.02 -0.02 0.04 -0.029 0.06 -0.009 0.019 -0.019 0.038 -0.027 0.058 -0.008 0.02 -0.015 0.04 -0.022 0.06 -0.008 0.021 -0.016 0.042 -0.022 0.063 -0.006 0.02 -0.011 0.04 -0.016 0.061 -0.006 0.022 -0.012 0.044 -0.016 0.066 -0.005 0.023 -0.007 0.047 -0.011 0.071 -0.003 0.019 -0.006 0.039 -0.008 0.058a1.342 1.342 0 0 0 0 0.263c0.002 0.02 0.006 0.039 0.008 0.058 0.003 0.024 0.006 0.047 0.011 0.071 0.004 0.022 0.011 0.044 0.016 0.066 0.005 0.02 0.009 0.041 0.016 0.061 0.006 0.021 0.015 0.042 0.022 0.063 0.007 0.02 0.014 0.04 0.022 0.06 0.008 0.02 0.018 0.038 0.027 0.058 0.01 0.02 0.019 0.041 0.029 0.061 0.01 0.018 0.021 0.036 0.032 0.054 0.012 0.019 0.023 0.039 0.035 0.058 0.013 0.02 0.028 0.038 0.042 0.057 0.012 0.016 0.023 0.032 0.036 0.048 0.028 0.034 0.057 0.066 0.088 0.097l0.001 0.001 5.333 5.333c0.521 0.521 1.365 0.521 1.886 0 0.521 -0.521 0.521 -1.365 0 -1.886l-3.057 -3.057z"
                stroke="#4f4f4fe6"
                fill="#4f4f4fe6"
              />
              <path
                d="M31.698 20.845c0.013 -0.015 0.024 -0.032 0.036 -0.048 0.014 -0.019 0.029 -0.037 0.042 -0.057 0.013 -0.019 0.024 -0.039 0.035 -0.058 0.011 -0.018 0.022 -0.035 0.032 -0.054 0.011 -0.02 0.02 -0.04 0.029 -0.061 0.009 -0.019 0.019 -0.038 0.027 -0.058 0.008 -0.02 0.015 -0.04 0.022 -0.06 0.008 -0.021 0.016 -0.042 0.022 -0.063 0.006 -0.02 0.011 -0.04 0.016 -0.061 0.006 -0.022 0.012 -0.044 0.016 -0.066 0.005 -0.023 0.007 -0.047 0.011 -0.071 0.003 -0.019 0.006 -0.039 0.008 -0.058 0.009 -0.087 0.009 -0.176 0 -0.263 -0.002 -0.02 -0.006 -0.039 -0.008 -0.058 -0.003 -0.024 -0.006 -0.047 -0.011 -0.071 -0.004 -0.022 -0.011 -0.044 -0.016 -0.066 -0.005 -0.02 -0.009 -0.041 -0.016 -0.061 -0.006 -0.021 -0.015 -0.042 -0.022 -0.063 -0.007 -0.02 -0.014 -0.04 -0.022 -0.06 -0.008 -0.02 -0.018 -0.038 -0.027 -0.058 -0.01 -0.02 -0.019 -0.041 -0.029 -0.061 -0.01 -0.018 -0.021 -0.036 -0.032 -0.054 -0.012 -0.019 -0.023 -0.039 -0.035 -0.058 -0.013 -0.02 -0.028 -0.038 -0.042 -0.057 -0.012 -0.016 -0.023 -0.032 -0.036 -0.048a1.335 1.335 0 0 0 -0.087 -0.096l-0.001 -0.001 -5.333 -5.333c-0.521 -0.521 -1.365 -0.521 -1.886 0s-0.521 1.365 0 1.886l3.057 3.057H12c-0.736 0 -1.333 0.597 -1.333 1.333s0.597 1.333 1.333 1.333h15.448l-3.057 3.057c-0.521 0.521 -0.521 1.365 0 1.886s1.365 0.521 1.886 0l5.333 -5.333 0.001 -0.001a1.379 1.379 0 0 0 0.087 -0.096z"
                stroke="#4f4f4fe6"
                fill="#4f4f4fe6"
              />
            </g>
          </g>
        </g>
      </svg>
    )
  }
  

const ShowBalance = ({address, isSigner} : ShowBalanceProps) => {
    // const router = useRouter();
    // const address = router.query.address as QueryParams['address'] as `0x${string}`;
    const [isClient, setIsClient] = useState(false);
    // const { address } = useParams();
    // const { data: paramBal } = useBalance({ address: address as `0x${string}` });
    // const { address: eoa } = useAccount();
    // const { data: eoaBal } = useBalance({ address: eoa });
    // const vsa = useSmartAccountAddress();
    // const { data: vsaBal } = useBalance({ address: vsa}) 

    const { data: bal } = useBalance({ address: address as `0x${string}`, watch: true });
    const { chain } = useNetwork();
 

    useEffect(() => {
      setIsClient(true);
    }, [])
  
    return (
      <div className={styles.yourBalanceContainer}>
        <span className={styles.profileSectionTitle}>
          {// ((address&&eoa&&address===eoa) ||
          // (address&&vsa&&address===vsa)  ||
          // ((vsa || eoa )&&!address))  &&
          isClient&&isSigner&&'YOUR'} BALANCE
        </span>
        {isClient && <div>
          <div className={styles.balanceValueContainer}>
            <span className={styles.balanceValue}>
              {/* {paramBal
              ? parseFloat(formatEther(paramBal.value)).toFixed(4)
              : eoaBal 
                ? parseFloat(formatEther(eoaBal.value)).toFixed(4)
                : vsaBal
                  ?  parseFloat(formatEther(vsaBal.value)).toFixed(4)
                  : "Loading..."
            }  */}
            {bal? parseFloat(formatEther(bal.value)).toFixed(4) : ''}
            </span>
            <span className={styles.balanceCurrency}>
              {/* {(paramBal||eoaBal||vsaBal) && 'ETH'} */}
              {bal && chain?.nativeCurrency.symbol}
            </span>
          </div>
        </div>}
      </div>
    )
}

const Buttons = ({setOpenTransfer, setOpenConnect, enabled}: {setOpenTransfer: any, setOpenConnect: any, enabled: boolean}) => {
  // const [style1, setStyle1] = useState(styles.balanceActionsContainerDisabled);
  const [style2, setStyle2] = useState(styles.actionContainerDisabled)
  useEffect(() => {
    if(enabled){
      // setStyle1(styles.balanceActionsContainer);
      setStyle2(styles.actionContainer)
    } else {
      // setStyle1(styles.balanceActionsContainerDisabled)
      setStyle2(styles.actionContainerDisabled)
    }
  }, [enabled]);

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

  // console.log('style', style)
  // console.log('enabled', enabled);
  return (
    <div className={styles.balanceActionsContainer}>
            <div className={style2} onClick={onClickTransfer}><SendIcon enabled={enabled} /></div>
            <div className={style2} onClick={onClickConnect}><SwapIcon enabled={enabled}/></div>
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
      <div className={disabled? styles.disabled : ''}>
        <div className={styles.primaryButton} onClick={() => onTransfer()}>
          Transfer
        </div>
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
      <div className={(disabled || loading)? styles.disabled : ''}>
        <div className={styles.primaryButton} onClick={() => onConnect()}>
           Connect
        </div>
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
    <>
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
    </>
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

  // const [disableActions, setDisalbleAction] = useState<boolean>();
  const eoa = useAccount();
  const vsaAddr = useSmartAccountAddress();
  
  return (
    <div>
        <ShowBalance address={address?? eoa.address?? vsaAddr} isSigner={address? (address==eoa.address) || (address==vsaAddr) : true } />
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

  )
}