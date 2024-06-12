import { ApproveData, OnApproveArgs, SessionEventType, TxResolved } from "@/types";
import { Web3WalletTypes } from "@walletconnect/web3wallet";
import ProcessingDialog from "./processing";
import ErrorDialog from "./error";
import { TxRequestDialog, TxSuccess } from "./tx";
import { ConnectDialog } from "./connect";
import SignatureDialog from "./signature";
import { WalletDialogType } from "@/types";
import InternalTxDialog from "./internal";

interface WalletActionDialogProps {
    address?: string,
    close: (type?: WalletDialogType) => void;
    isProcessing: boolean;
    error?: any;
    hash?: string;
    openConnect: boolean;
    isLoading: boolean;
    approveData?: ApproveData;
    onConnect: (uri: string) => Promise<void>;
    onApprove: (args: OnApproveArgs) => Promise<void>
    onReject: (eventType: 'proposal' | 'request') => Promise<void>
}


export default function WalletActionDialog ({
    address,
    close,
    isProcessing,
    error,
    hash,
    openConnect,
    isLoading,
    approveData,
    onConnect,
    onApprove,
    onReject
} : WalletActionDialogProps) {

    return (
        <>
        {isProcessing
         ? <ProcessingDialog/>
         : error
          ? <ErrorDialog close={() => close('error')} message={error.message}/>
          : hash
           ? <TxSuccess close={() => close('txResolved')} hash={hash} address={address}/>
           : (approveData?.type === 'Transaction' || approveData?.type === 'Signature')
             ? <RequestDialog
                close={() => {}}
                approveData={approveData}
                onApprove={() => onApprove({ type: 'exteral', eventType: 'request'})}
                onReject={() => onReject('request')}
               />
             : approveData?.type === 'Internal'
              ? <InternalTxDialog
                close={close}
                approveData={approveData}
                onConfirm={() => onApprove({ type: 'internal' })}
                />
              : openConnect
                ? <ConnectDialog
                    close={() => close('connect')}
                    sessionProposal={
                        approveData?.type === 'Connection' ? approveData.data.sessionProposal : undefined
                    }
                    isLoading={isLoading}
                    onConnect={onConnect}
                    onApprove={() => onApprove({ type: 'exteral', eventType: 'proposal'})}
                    onReject={() => onReject('proposal')}
                    />
                : <div>
                        Unexpected Error
                    </div>
        }
        </>
    )
}

interface RequestDialogProps {
    close: any;
    approveData: ApproveData;
    onApprove: () => Promise<void>;
    onReject: () => Promise<void>;
}

function RequestDialog ({
    approveData,
    onApprove,
    onReject
} : RequestDialogProps) {

    if(approveData.type === 'Transaction') {
        return (
            <TxRequestDialog
            close={close}
            sessionRequest={approveData.data}
            onApprove={onApprove}
            onReject={onReject}
            />
        )
    } else if(approveData.type === 'Signature') {
        return (
            <SignatureDialog
            close={close}
            sessionRequest={approveData.data}
            onApprove={onApprove}
            onReject={onReject}
            />
        )
    } else {
        return (
            <div>
                Something unexpected happened
            </div>
        )
    }   
}