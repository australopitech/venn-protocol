import { Web3Wallet as Web3WalletType } from "@walletconnect/web3wallet/dist/types/client";
import { getSdkError } from '@walletconnect/utils';
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { SmartAccountProvider } from "@alchemy/aa-core";
import { formatJsonRpcResult, formatJsonRpcError } from "@json-rpc-tools/utils";
import { formatParams } from "@/utils/utils";
import { SessionEventType } from "@/types";

export async function approveSessionProposal (
    data: any,
    wallet?: Web3WalletType,
  ) {
    if(!wallet)
      throw new Error('no wallet found');
    
    await wallet.approveSession({
      id: data.sessionProposal.id,
      namespaces: data.namespaces
    });
}

  export async function rejectSessionProposal (
    data: any,
    stateResetter: (e: 'proposal') => void,
    wallet?: Web3WalletType
  ) {
    if(!wallet)
      throw new Error('no wallet found');
    await wallet.rejectSession({
      id: data.sessionProposal?.id,
      reason: getSdkError("USER_REJECTED")
    });    
    stateResetter('proposal');
  }

  export async function disconnectSession(
    topic: any,
    wallet?: Web3WalletType,
  ) {
    if(!wallet)
      throw new Error('No wallet found.')
    await wallet.disconnectSession({
      topic,
      reason: getSdkError('USER_DISCONNECTED')
    });
  }

  
  export async function resolveSessionRequest (
    request: any,
    accountProvider: AlchemyProvider | SmartAccountProvider,
    wallet?: Web3WalletType
  ) {
    if(!wallet)
      throw new Error('no wallet found');
    let { method, params } = request.params.request;
    params = formatParams(method, params);
    const res = await accountProvider.request({ method, params });
    return res;
  }
  
  export async function rejectSessionRequest (
    request: any,
    stateResetter: (e: 'request') => void,
    wallet?: Web3WalletType
  ) {
    if(!wallet)
      throw new Error('no wallet found');
    const response = formatJsonRpcError(
      request.id,
      getSdkError('USER_REJECTED').message
    );
    console.log('responding...');
    await wallet.respondSessionRequest({
      topic: request.topic,
      response
    });
    stateResetter('request');
  }

  export async function resolveApprovalExternal (
    event: SessionEventType,
    data: any,
    stateResetter: (e: 'proposal' | 'request') => void,
    wallet: Web3WalletType,
    accountProvider?: AlchemyProvider | SmartAccountProvider,
  ) {
    let response: any;
    let res: any;
    let error: any;
    const { id, topic } = data;
    try {
      if(!accountProvider) {
        response = formatJsonRpcError(id, getSdkError("USER_DISCONNECTED").message);
      } else {
        switch (event) {
          case 'Connection':
            await approveSessionProposal(data, wallet);
            break
          case 'Transaction':
          case 'Signature':
            const _data = data;        
            res = await resolveSessionRequest(_data, accountProvider, wallet);
            console.log('tx', res);
            response = formatJsonRpcResult(id, res);
            break
        }
      }
    } catch(err: any) {
      console.error(err);
      response = formatJsonRpcError(id, err.message);
      error = err;
    }
    if(response || topic)
      await wallet.respondSessionRequest({
        topic,
        response
    });
    if(event === 'Connection')
      stateResetter('proposal');
    else
      stateResetter('request');
    // const hash = res.hash;
    return { hash: res, error }
  }

 export async function resolveApprovalInternal (
    data: any,
    accountProvider: AlchemyProvider | SmartAccountProvider,
  ) {
    let error: any;
    let hash: any;
    try {
      const res = await accountProvider.sendUserOperation({
        target: data.targetAddress,
        value: data.value,
        data: data.calldata ?? '0x'
      });
      hash = await accountProvider.waitForUserOperationTransaction(res.hash);
      console.log('tx', hash);
    } catch (err) {
      console.error(err);
      error = err
    } finally {
      return { hash, error }
    }
  }