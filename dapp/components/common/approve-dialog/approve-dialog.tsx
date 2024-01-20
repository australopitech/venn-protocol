'use client'
import styles from './approve-dialog.module.css';
import { useApproveSessionProposal, useApproveSessionRequest, useRejectSessionProposal, useRejectSessionRequest, useSessionDemand } from '@/app/venn-provider';
import { useCallback, useState } from 'react';
import { SessionDemandType } from '@/app/venn-provider';
import { ApproveData } from '@/components/dashboard/dashboard-layout/dashboard-layout';

interface ApproveDialogProps {
  // setOpenApproveDialog: any;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  onClose: () => void;
  approveData?: ApproveData;
  loading: boolean;
  error?: any
  txResolved?: TxResolved
}

export interface TxResolved {
  success: boolean;
  hash?: string;
}

interface ButtonProps {
  onClick?: any
}

interface Event {
  id: number
  params: {
    id: number
    expiry: number
    relays: Array<{
      protocol: string
      data?: string
    }>
    proposer: {
      publicKey: string
      metadata: {
        name: string
        description: string
        url: string
        icons: string[]
      }
    }
    requiredNamespaces: Record<
      string,
      {
        chains: string[]
        methods: string[]
        events: string[]
      }
    >
    pairingTopic?: string
  }
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
  // const { demandType, data } = useSessionDemand();
  // const demandType = 'Connection'
  // const data = {
  //   proposer: {
  //     metadata: {
  //       name: 'exchange tokens bla bla at Uniswap',
  //       description: "exchange tokens bla bla at Uniswap",
  //       url: 'wwww.uniswap.org',
  //       icons: []
  //     }
  //   }
  // }

  

  return (
    <>
    <div className={styles.approveDialogBackdrop}>
        <dialog className={styles.approveDialog} open>
            <div className={styles.approveDialogContent}>
                {loading
                  ? <div className={styles.approveDescriptionContainer}>
                      <div className={styles.loading}> 
                        <div className={styles.loadingTitle}>Processing...</div>
                        <div className={styles.loadingDescription}>Please wait while your request is processed. </div>
                      </div>
                    </div>
                  : error
                    ? <div className={styles.approveDescriptionContainer}>
                        <div className={styles.ErrorTitle}>An Error ocurred!</div>
                        <div className={styles.ErrorDescription}> This error ocurred while processing your request: </div>
                        <div className={styles.approveDescription}>{error}</div>
                        <div className={styles.buttonContainer}> <CloseButton onClick={() => onClose()}/> </div>
                      </div>
                    : txResolved?.success
                      ? <div className={styles.approveDescriptionContainer}>
                          <div className={styles.txTitle}>Transaction Successful!!</div>
                          <div className={styles.txDescription}>tx hash: {txResolved.hash}</div>
                          <div className={styles.buttonContainer}> <CloseButton onClick={() => onClose()}/> </div>
                        </div>
                      : <div className={styles.approveDescriptionContainer}>
                          <h1 className={styles.title}>Approve {approveData?.type}</h1>
                          {approveData?.type === 'Connection'
                            ?<div className={styles.approveDescription}>
                              Connect to {approveData?.data.proposer.metadata.url} ?
                            </div>
                            :  <div>
                                  <div className={styles.approveType}>
                                    {approveData?.type === 'Signature' ? 'Signature Request' : 'Approve '}{approveData?.type}?
                                  </div>
                                  {!(approveData?.type === 'Transfer') &&
                                    <p className={styles.approveDescription}>
                                      <br/>
                                      - Origin: <br/>
                                    </p>}
                                  {!(approveData?.type === 'Signature') &&
                                    <>
                                    <p className={styles.approveDescription}>
                                      <br/>
                                      - Value: <br/>
                                    </p>
                                    <p className={styles.approveDescription}>
                                      - Gas: 
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

