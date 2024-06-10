import { SessionEventType, TxResolved } from "@/types";
import { Web3WalletTypes } from "@walletconnect/web3wallet";
import ProcessingDialog from "./processing";
import ErrorDialog from "./error";
import { TxRequestDialog, TxSuccess } from "./tx";
import { ConnectDialog } from "./connect";
import SignatureDialog from "./signature";
import { WalletDialogType } from "@/types";

interface WalletActionDialogProps {
    address?: string,
    close: (type: WalletDialogType) => void;
    isProcessing: boolean;
    error?: any;
    hash?: string;
    openConnect: boolean;
    isLoading: boolean;
    sessionProposal?: Web3WalletTypes.SessionProposal;
    sessionRequest?: Web3WalletTypes.SessionRequest;
    sessionEvent?: SessionEventType;
    onConnect: (uri: string) => Promise<void>;
    onApprove: (eventType: 'proposal' | 'request') => Promise<void>
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
    sessionProposal,
    sessionRequest,
    sessionEvent,
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
           : (sessionRequest && sessionEvent)
             ? <RequestDialog
                close={() => {}}
                sessionRequest={sessionRequest}
                sessionEvent={sessionEvent}
                onApprove={() => onApprove('request')}
                onReject={() => onApprove('request')}
               />
             : openConnect
              ? <ConnectDialog
                close={() => close('connect')}
                sessionProposal={sessionProposal}
                isLoading={isLoading}
                onConnect={onConnect}
                onApprove={() => onApprove('proposal')}
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
    sessionRequest: Web3WalletTypes.SessionRequest;
    sessionEvent: SessionEventType;
    onApprove: () => Promise<void>
    onReject: () => Promise<void>
}

function RequestDialog ({
    sessionRequest,
    sessionEvent,
    onApprove,
    onReject
} : RequestDialogProps) {

    if(sessionEvent === 'Transaction') {
        return (
            <TxRequestDialog
            close={close}
            sessionRequest={sessionRequest}
            onApprove={onApprove}
            onReject={onReject}
            />
        )
    } else if(sessionEvent === 'Signature') {
        return (
            <SignatureDialog
            close={close}
            sessionRequest={sessionRequest}
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