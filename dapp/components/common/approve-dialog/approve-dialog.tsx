'use client'
import styles from './approve-dialog.module.css';
import { useApproveSessionProposal, useApproveSessionRequest, useRejectSessionProposal, useRejectSessionRequest, useSessionDemand } from '@/app/venn-provider';
import { useCallback, useState } from 'react';

interface ApproveDialogProps {
  setOpenApproveDialog: any;
}

export interface TxResolved {
  success: boolean;
  hash?: string,
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


export default function ApproveDialog ({setOpenApproveDialog} : ApproveDialogProps) {
  const { demandType, data } = useSessionDemand();
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

  const [txResolved, setTxResolved] = useState<TxResolved>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const onApproveProposal = useApproveSessionProposal();
  const onRejectProposal = useRejectSessionProposal();
  const onApproveRequest = useApproveSessionRequest();
  const onRejectRequest = useRejectSessionRequest();

  const onApprove = useCallback(async () => {
    setLoading(true);
    let _error: any;
    switch (demandType) {
      case 'Connection':
        try{
          await onApproveProposal();
        } catch(err: any) {
          setError(err);
        } finally {
          setLoading(false);
        }
        break;
      case 'Transaction':
        let hash: any        
        try {
          hash = await onApproveRequest();
        } catch(err: any) {
          _error = err;
          setError(err);
        } finally {
          setLoading(false);
          setTxResolved({success: !_error, hash});
        }
        break;
      case 'Signature':
        try {
          hash = await onApproveRequest();
        } catch(err: any) {
          _error = err;
          setError(err);
        } finally {
          setLoading(false);
        }
        break;
    }
  }, [
    demandType, onApproveProposal, onApproveRequest,
    setError, setLoading, setTxResolved
  ]);

  const onReject = useCallback(async () => {
    setLoading(true);
    switch (demandType) {
      case 'Connection':
        try {
          await onRejectProposal();
        } catch (err: any) {
          setError(err);
        } finally {
          setLoading(false);
        }
        break
      case 'Transaction':
      case 'Signature':
        try {
          await onRejectRequest();
        } catch (err: any) {
          setError(err);
        } finally {
          setLoading(false);
        }
        break;
    }
  },[
    demandType, onRejectProposal, 
    onRejectRequest, setLoading, setError
  ]);

  const resetState = useCallback(() => {
    setError(undefined);
    setTxResolved(undefined); //put undefined
    setOpenApproveDialog(false);
  }, [setError, setTxResolved]);


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
                        <div className={styles.buttonContainer}> <CloseButton onClick={() => resetState()}/> </div>
                      </div>
                    : txResolved?.success
                      ? <div className={styles.approveDescriptionContainer}>
                          <div className={styles.txTitle}>Transaction Successful!!</div>
                          <div className={styles.txDescription}>tx hash: {txResolved.hash}</div>
                          <div className={styles.buttonContainer}> <CloseButton onClick={() => resetState()}/> </div>
                        </div>
                      : <div className={styles.approveDescriptionContainer}>
                          <h1 className={styles.title}>Approve {demandType}</h1>
                          {demandType === 'Connection'
                            ?<p className={styles.approveDescription}>
                              Connect to {data.proposer.metadata.url} ?
                            </p>
                            : ''
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

