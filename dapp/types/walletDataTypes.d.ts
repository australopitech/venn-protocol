import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { SessionTypes } from "@walletconnect/types";

export type SessionEventType = 'Connection' | 'Transaction' | 'Signature';

type txInputs = {
    targetAddress: `0x${string}`,
    value?: bigint,
    calldata?: `0x${string}`
}

export type ApproveData = {
    type: SessionEventType,
    data: {
        sessionProposal?: Web3WalletTypes.SessionProposal,
        namespaces?: SessionTypes.Namespaces
        sessionRequest?: Web3WalletTypes.SessionRequest,
        tx?: txInputs
    }
} | {
    type: 'Transfer' | 'Internal';
    data: txInputs
}

export interface TxResolved {
    success: boolean;
    hash?: string;
}