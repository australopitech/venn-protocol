'use client'
import styles from './approve-dialog.module.css';
import { useApproveSessionProposal, useApproveSessionRequest, useRejectSessionProposal, useRejectSessionRequest, useSessionDemand } from '@/app/venn-provider';
import { error } from 'console';
import { useCallback, useState } from 'react';

interface TxResolved {
  success: boolean;
  hash?: string,
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

const ApproveButton = () => {
  return (
    <div className={styles.primaryButton}>
      Approve
    </div>
  )
}

const RejectButton = () => {
  return (
    <div className={styles.secondaryButton}>
      Reject
    </div>
  )
}

const CloseButton = () => {
  return (
    <div className={styles.closeButton}>
      Close
    </div>
  )
}


export default function ApproveDialog () {
//   const { demandType, data } = useSessionDemand();
  const demandType = 'Connection'
  const data = {
    proposer: {
      metadata: {
        name: 'exchange tokens bla bla at Uniswap',
        description: "exchange tokens bla bla at Uniswap",
        url: 'wwww.uniswap.org',
        icons: []
      }
    }
  }

  const [txResolved, setTxResolved] = useState<TxResolved>({success:true, hash: '0xdhaiohjfsiahfioahjsiofhjaio'});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onApproveProposal = useApproveSessionProposal();
  const onRejectProposal = useRejectSessionProposal();
  const onApproveRequest = useApproveSessionRequest();
  const onRejectRequest = useRejectSessionRequest();

  const onApprove = useCallback(async () => {
    setLoading(true)
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
        let error: any;
        try {
          hash = await onApproveRequest();
        } catch(err: any) {
          error = err;
          setError(err);
        } finally {
          setLoading(false);
          setTxResolved({success: !error, hash});
        }
    }
  }, [])


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
                        <div className={styles.buttonContainer}> <CloseButton /> </div>
                      </div>
                    : txResolved?.success
                      ? <div className={styles.approveDescriptionContainer}>
                          <div className={styles.txTitle}>Transaction Successful!!</div>
                          <div className={styles.txDescription}>tx hash: {txResolved.hash}</div>
                          <div className={styles.buttonContainer}> <CloseButton /> </div>
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
                            <RejectButton />
                            <ApproveButton />
                          </div>
                        </div>
                  }
            </div>
        </dialog>
    </div>
    </>
  )
}

