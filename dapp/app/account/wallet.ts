import { Web3Wallet as Web3WalletType } from "@walletconnect/web3wallet/dist/types/client";
import { getSdkError } from '@walletconnect/utils';

export async function approveSessionProposal (
    data: any,
    stateResetter: (event: 'proposal') => void,
    wallet?: Web3WalletType,
  ) {
    if(!wallet)
      throw new Error('no wallet found');
    try {
      await wallet.approveSession({
        id: data.sessionProposal.id,
        namespaces: data.namespaces
      })
    } catch (error) {
      console.error(error)
    } finally {
      stateResetter('proposal');
    }
  }

  export async function rejectSessionProposal (
    data: any,
    stateResetter: (e: 'proposal') => void,
    wallet?: Web3WalletType
  ) {
    if(!wallet)
      throw new Error('no wallet found');
    try {
      await wallet.rejectSession({
        id: data.sessionProposal?.id,
        reason: getSdkError("USER_REJECTED")
      });
    } catch (error) {
      console.error(error)
    } finally {
      stateResetter('proposal');
    }
  }
  