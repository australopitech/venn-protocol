import { Web3Wallet as Web3WalletType } from "@walletconnect/web3wallet/dist/types/client";

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