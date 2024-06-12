import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { SessionTypes } from "@walletconnect/types";

export type WalletDialogType = 'connect' | 'error' | 'txResolved';

export type SessionEventType = 'Connection' | 'Transaction' | 'Signature';

type SessionRequest = Web3WalletTypes.SessionRequest

type SessionProposal = {
    sessionProposal: Web3WalletTypes.SessionProposal,
    namespaces: SessionTypes.Namespaces
}

type TxInputs = {
    targetAddress: `0x${string}`,
    value?: bigint,
    calldata?: `0x${string}`,
    method?: string
}

export type ApproveData = {
    type: 'Connection',
    data: SessionProposal
} | {
    type: 'Transaction' | 'Signature',
    data: SessionRequest
} | {
    type: 'Transfer' | 'Internal';
    data: TxInputs
}

export interface TxResolved {
    success: boolean;
    hash?: string;
}

export type OnApproveArgs = {
    type: 'internal'
} | {
    type: 'exteral',
    eventType: 'proposal' | 'request'
}