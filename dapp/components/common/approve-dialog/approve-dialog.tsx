'use client'
import styles from './approve-dialog.module.css';
import { useSmartAccount } from '@/app/account/venn-provider';
import { useCallback, useEffect, useState } from 'react';
import { ApproveData, TxResolved } from '@/types';
import { useAccount, useNetwork } from 'wagmi';
import { useGasEstimation } from '@/hooks/tx-data';
import { formatUnits } from 'viem';
import { LoadingDotsBouncy } from '../loading/loading';

interface ApproveDialogProps {
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  onClose: () => void;
  approveData?: ApproveData;
  loading: boolean;
  error?: any
  txResolved?: TxResolved
}


interface ButtonProps {
  onClick?: any
}

// interface Event {
//   id: number
//   params: {
//     id: number
//     expiry: number
//     relays: Array<{
//       protocol: string
//       data?: string
//     }>
//     proposer: {
//       publicKey: string
//       metadata: {
//         name: string
//         description: string
//         url: string
//         icons: string[]
//       }
//     }
//     requiredNamespaces: Record<
//       string,
//       {
//         chains: string[]
//         methods: string[]
//         events: string[]
//       }
//     >
//     pairingTopic?: string
//   }
// }

const ErrorIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-xbox-x" width="40" height="40" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z" /><path d="M9 8l6 8" /><path d="M15 8l-6 8" /></svg>
  )
}

const SearchIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-search" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
  )
}

const SuccessIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-check" width="40" height="40" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" />
    </svg>
  )
}

const LoadingIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-hourglass" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.5 7h11" /><path d="M6.5 17h11" /><path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z" /><path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z" /></svg>
  )
}

export const ApproveButton = ({onClick}: ButtonProps) => {
  return (
    <div className={styles.primaryButton} onClick={onClick}>
      Approve
    </div>
  )
}

export const RejectButton = ({onClick}: ButtonProps) => {
  return (
    <div className={styles.secondaryButton} onClick={onClick}>
      Reject
    </div>
  )
}

export const CloseButton = ({onClick}: ButtonProps) => {
  return (
    <div className={styles.closeButton} onClick={onClick}>
      Close
    </div>
  )
}


export default function ApproveDialog ({ onApprove, onReject, onClose, loading, approveData, error, txResolved } : ApproveDialogProps) {
  const [blocker, setBlocker] = useState(false);
  const decimals = 18
  const { address: eoa } = useAccount();
  const { address: vsa } = useSmartAccount();
  const { chain } = useNetwork();
  console.log('approveData', approveData)
  const { data: gas, gasFee, isLoading, error: gasError } = useGasEstimation({ approveData, blocker });
  // console.log('gas', gas, 'gasFee', gasFee, 'isLoading', isLoading, 'gasError', gasError);
  // console.log('txResolved', txResolved)

  useEffect(() => {
    console.log('render');
    if(loading || error || txResolved)
      setBlocker(true);
  }, [loading, error, txResolved])


  const value = approveData?.type === 'Transaction'
    ? approveData.data.params.request.params[0].value ? BigInt(approveData.data.params.request.params[0].value) : 0n
    : approveData?.type === 'Transfer' || approveData?.type === 'Internal'
      ? approveData?.data.value ? approveData?.data.value : 0n
      : undefined


  return (
    <>
    <div className={styles.approveDialogBackdrop}>
        <dialog className={styles.approveDialog} open>
            <div className={styles.approveDialogContent}>
                {loading
                  ? <div className={styles.approveDescriptionContainer}>
                      <div className={styles.loading}> 
                        <div className={styles.loadingTitle}><LoadingIcon /> Processing...</div>
                        <div className={styles.loadingDescription}>Please wait while your request is processed. </div>
                        <div className={styles.loadingDots}><LoadingDotsBouncy/> </div>
                      </div>
                    </div>
                  : error
                    ? <div className={styles.approveDescriptionContainer}>
                        <div className={styles.errorTitle}><ErrorIcon/> An Error ocurred!</div>
                        <div className={styles.errorDescription}> This error ocurred while processing your request: </div>
                        <div className={styles.errorMessage}>{error.message}</div>
                        {error.code === '001' && 
                          <a 
                          className={styles.txLink}
                          href={chain?.blockExplorers?.default.url + `/account/${vsa ?? eoa}`}
                          target='_blank'
                          > 
                          Click here to see your account.
                        </a>}
                        <div className={styles.buttonContainer}> <CloseButton onClick={() => onClose()}/> </div>
                      </div>
                    : txResolved?.success
                      ? <div className={styles.approveDescriptionContainer}>
                          <div className={styles.txTitle}><SuccessIcon /> <span style={{paddingLeft: '4px'}}>Transaction Successful!!</span></div>
                          <div className={styles.txDescription}>
                            <div className={styles.txLinkContainer}>
                              <SearchIcon />
                              <a href={`https://mumbai.polygonscan.com/tx/${txResolved.hash}`} target='_blank' className={styles.txLink}>
                              View it on block explorer.
                              </a>
                            </div>
                          </div>
                          <div className={styles.buttonContainer}> <CloseButton onClick={() => onClose()}/> </div>
                        </div>
                      : <div className={styles.approveDescriptionContainer}>
                          <h1 className={styles.title}>Approve {approveData?.type === 'Internal' ? 'Transaction' : approveData?.type}</h1>
                          {approveData?.type === 'Connection'
                            ?<div className={styles.approveDescription}>
                              Connect to {approveData?.data.sessionProposal?.params.proposer.metadata.url} ?
                            </div>
                            :  <div>
                                  <div className={styles.approveType}>
                                    {approveData?.type === 'Signature' ? 'Signature Request' : 'Approve this '}{approveData?.type === 'Transfer' ? 'transfer' : 'transaction'}?
                                  </div>
                                  {!(approveData?.type === 'Transfer' || approveData?.type === 'Internal') &&
                                    <p className={styles.approveDescription}>
                                      <br/>
                                      - Origin: {approveData?.type === 'Transaction' || approveData?.type === 'Signature'
                                      ? approveData.data.verifyContext.verified.origin
                                      : ''}
                                    </p>}
                                  {!(approveData?.type === 'Signature') &&
                                    <>
                                    <p className={styles.approveDescription}>
                                      <br/>
                                      - Gas Fee<span className={styles.approveDescriptionMeta}>(estimated)</span>: 
                                      {isLoading? ' loading...' : (gas && gasFee)? ' ' + formatUnits(gas * gasFee, decimals)+' MATIC' : ` error fetching gas: ${gasError?.message}`}
                                    </p>
                                    <p className={styles.approveDescription}>
                                      <br/>
                                      - Total Value: {isLoading
                                      ? 'loading...'
                                      : (value !== undefined && gas && gasFee)
                                        ? <span>
                                          {formatUnits(value, decimals)} + <span className={styles.approveDescriptionMeta}>gas fee </span>
                                          = {formatUnits(value + (gas * gasFee), decimals)} MATIC
                                          </span>
                                        : null
                                      }
                                    </p>
                                    </>}
                                </div>
                          }
                          <div className={styles.buttonContainer}>
                            <RejectButton onClick={() => onReject()}/>
                            <ApproveButton onClick={() => onApprove()}/>
                          </div>
                        </div>
                  }
            </div>
        </dialog>
    </div>
    </>
  )
}

