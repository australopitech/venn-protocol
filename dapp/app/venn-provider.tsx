'use client'
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { LightSmartContractAccount } from "@alchemy/aa-accounts";
import { Web3AuthSigner } from "@alchemy/aa-signers/web3auth";
import { Web3Wallet as Web3WalletType } from "@walletconnect/web3wallet/dist/types/client";
import { Web3Wallet, Web3WalletTypes  } from '@walletconnect/web3wallet';
// import { SessionTypes } from "@walletconnect/types";
import { Core } from '@walletconnect/core';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'
import { baseGoerli, mainnet, polygonMumbai } from "viem/chains";
import { factoryContract } from "@/utils/contractData";
import { createWeb3AuthSigner } from "@/utils/web3auth";
import { SessionTypes } from "@walletconnect/types";
import { formatParams } from "@/utils/utils";
import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { WalletClient } from "viem";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import { getDefaultEntryPointAddress } from "@alchemy/aa-core";
import { chains as supportedChains } from "./wagmi";
import { resolveProviderKey } from "./chain-provider";

type VennSmartAccountContextType = {
    vsaProvider?: AlchemyProvider;
    accountAddress?: `0x${string}`;
    triggerVsaUpdate: () => void;
};

export type SessionDemandType = 'Connection'|'Transaction'|'Signature';

type VennWalletContextType = {
  vennWallet?: Web3WalletType;
  setVennWallet: React.Dispatch<React.SetStateAction<Web3WalletType | undefined>>;
  sessionProposal?: Web3WalletTypes.SessionProposal;
  setSessionProposal: React.Dispatch<React.SetStateAction<Web3WalletTypes.SessionProposal | undefined>>;
  sessionRequest?:Web3WalletTypes.SessionRequest;
  setSessionRequest: React.Dispatch<React.SetStateAction<Web3WalletTypes.SessionRequest | undefined>>;
  namespaces?: SessionTypes.Namespaces;
  setNamespaces: React.Dispatch<React.SetStateAction<SessionTypes.Namespaces | undefined>>;
  sessionDemand: SessionDemandType | undefined;
  setSessionDemand: React.Dispatch<React.SetStateAction<SessionDemandType | undefined>>;
  setNewPairingTopic:React.Dispatch<React.SetStateAction<string | undefined>>;
  updater: boolean;
}
// test
const entryPointAddr = getDefaultEntryPointAddress(baseGoerli);
//
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_BASE_API_KEY;
const activeNetwork = baseGoerli;
const factoryAddress = factoryContract.address;
// const supportedChains = [baseGoerli];


const createAccountProvider = (walletClient: WalletClient) => {
  const signer = new WalletClientSigner(walletClient, "json-rpc");
  const chain = walletClient.chain;
  if(!chain) throw new Error('undefined chain');
  const apiKey = resolveProviderKey(chain.id);
  if(!apiKey) throw new Error('missing apiKey');
  return new AlchemyProvider({
    apiKey,
    chain
  }).connect(
    (rpcClient) =>
    new LightSmartContractAccount({
        chain: activeNetwork,
        owner: signer,
        factoryAddress,
        rpcClient
    })
  );
}

const createWeb3Wallet = async () => {
  if(!projectId) throw new Error('missing projectId');;
  const core = new Core({ projectId  });
  return await Web3Wallet.init({
    core,
    metadata: {
      name: 'Venn Smart Wallet',
      description	: 'Venn Protocol Smart Account Wallet',
      url: '',
      icons:[]
    }
  });
}


const VennSmartAccont = createContext<VennSmartAccountContextType | null>(null);
const VennWalelt = createContext<VennWalletContextType | null>(null);

const getApprovedNamespaces = (account: `0x${string}`, proposal: Web3WalletTypes.SessionProposal) => {
  return buildApprovedNamespaces({
    proposal: proposal.params,
    supportedNamespaces: {
      eip155: {
        chains: [`eip155:${mainnet.id}`, `eip155:${polygonMumbai.id}`],
        methods: [
            'eth_sendTransaction', 'personal_sign', 'eth_sign', 'eth_signTypedData_v4',
            'eth_signTypedData', 'eth_signTransaction', 'eth_sendRawTransaction'
        ],
        events: ['accountsChanged', 'chainChanged'],
        accounts: [`eip155:${mainnet.id}:${account}`,`eip155:${polygonMumbai.id}:${account}`]
      }
    }
  });
}

const emitChainChanged = (
  wallet: Web3WalletType,
  chainId: number
) => {
  const sessions = wallet.getActiveSessions();
  try {
    Object.keys(sessions).forEach(async (key) => {
      const topic = sessions[key].topic;
      await wallet.emitSessionEvent({
        topic,
        event: {
          name: 'chainChanged',
          data: chainId
        },
        chainId: `eip155:${chainId}`
      })
    });
  } catch (error) {
    console.error(error);
  }
}

export function useApproveSessionProposal () {
  const context = useContext(VennWalelt);
  // const { chain } = useNetwork();
  console.log('state', context?.sessionProposal, context?.namespaces)
  return async () => {
    if(context && context.sessionProposal && context.namespaces ){
      try {
        await context.vennWallet?.approveSession({
          id: context.sessionProposal.id,
          namespaces: context.namespaces
        });
        context.setNewPairingTopic(context.sessionProposal.params.pairingTopic);
      } catch (error: any) {
        console.log(error)
        // alert(error.message);
      } 
    } else 
        throw new Error ('missing context: check state for session proposal and namespaces');
    context?.setSessionProposal(undefined);
    context?.setNamespaces(undefined);
    context?.setSessionDemand(undefined);
  }
}

export function useRejectSessionProposal () {
  const context = useContext(VennWalelt);
  return async () => {
    if(context && context.sessionProposal) {
      try {
        await context.vennWallet?.rejectSession({
          id: context.sessionProposal?.id,
          reason: getSdkError("USER_REJECTED")
        });
      } catch (error: any) {
        console.error(error);
      }
    } else
      throw new Error('missing context: check state for session proposal and namespaces');
    context?.setSessionProposal(undefined);
    context?.setNamespaces(undefined);
    context?.setSessionDemand(undefined);
  }
}

export function useApproveSessionRequest () {
  const walletContext = useContext(VennWalelt);
  const vsaContext = useContext(VennSmartAccont);  
  return async () => {
    if(walletContext?.sessionRequest) {
      let ret: any;
      let response: any;
      const { id, topic } = walletContext.sessionRequest
      if(vsaContext?.vsaProvider) {
        try {
          let { method, params } = walletContext.sessionRequest.params.request;
          params = formatParams(method, params);
          ret = await vsaContext.vsaProvider.request({ method, params });
          response = formatJsonRpcResult(id, ret);
          await walletContext.vennWallet?.respondSessionRequest({
              topic,
              response
          });
        } catch (error: any) {
          console.error(error);
          // alert(error.message);
          response = formatJsonRpcError(id, error.message);
          await walletContext.vennWallet?.respondSessionRequest({
              topic,
              response
          });
        } finally {
          walletContext.setSessionRequest(undefined);
          walletContext.setSessionDemand(undefined);
          return ret;
        }
      } else {
          response = formatJsonRpcError(id, getSdkError("USER_DISCONNECTED"));
          try {
            await walletContext.vennWallet?.respondSessionRequest({
              topic,
              response
            });
          } catch(error: any) {
            console.error(error);
            alert(error.message);
          } finally {
            walletContext.setSessionRequest(undefined);
            walletContext.setSessionDemand(undefined);
          }
      }
    } else {
      throw new Error ('missing context: check wallet provider');
    }
  }
}

export function useRejectSessionRequest() {
  const context = useContext(VennWalelt);
  return async () => {
    if(context?.sessionRequest) {
      const response = formatJsonRpcError(
        context.sessionRequest.id,
        getSdkError('USER_REJECTED')
      );
      try {
        await context.vennWallet?.respondSessionRequest({
          topic: context.sessionRequest.topic,
          response
        });
      } catch (error: any) {
        console.error(error);
        // alert(error.message);
      } finally {
        context.setSessionRequest(undefined);
        context.setSessionDemand(undefined);
      }
    }
  }
}

export function VennAccountProvider ({children} : {children : React.ReactNode}) {
  // const [signer, setSigner] = useState<Web3AuthSigner | null>(null);
  const { data: walletClient } = useWalletClient();
  // const { isConnected } = useAccount();
  const [vsaProvider, setVsaProvider] = useState<AlchemyProvider>();
  const [accountAddress, setAccountAddress] = useState<`0x${string}`>();
  const [vennWallet, setVennWallet] = useState<Web3WalletType>();
  const [sessionProposal, setSessionProposal] = useState<Web3WalletTypes.SessionProposal>();
  const [sessionRequest, setSessionRequest] = useState<Web3WalletTypes.SessionRequest>();
  const [namespaces, setNamespaces] = useState<SessionTypes.Namespaces>();
  const [updater, setUpdater] = useState(false);
  const [sessionDemand, setSessionDemand] = useState<SessionDemandType>();
  const [newPairingTopic, setNewPairingTopic] = useState<any>();
  const [activeSessions, setActiveSessions] = useState<any>();
  const { chain } = useNetwork();

  console.log('sessionProposal', sessionProposal);

  const triggerVsaUpdate = useCallback(() => {
    setUpdater(!updater);
  }, [updater, setUpdater]);
  
  // const onSessionProposal = useCallback((proposal: Web3WalletTypes.SessionProposal) => {
  //   console.log('session proposal', proposal);
  //   // console.log('state', sessionProposal, sessionDemand)
  //   if(!sessionProposal && !sessionDemand){
  //     setSessionProposal(proposal);
  //     setSessionDemand('Connection');
  //     console.log('accountAddress in handler', accountAddress)
  //     if(accountAddress) {
  //       console.log('flag')
  //       setNamespaces(getApprovedNamespaces(accountAddress, proposal));
  //     }
  //     else
  //       setNamespaces(undefined);
  //   }
  // }, [accountAddress, setNamespaces, setSessionProposal]);

  const onSessionProposal = (proposal: Web3WalletTypes.SessionProposal) => {
    console.log('session proposal', proposal);
    // console.log('state', sessionProposal, sessionDemand)
    if(!sessionProposal && !sessionDemand){
      setSessionProposal(proposal);
      setSessionDemand('Connection');
      console.log('accountAddress in handler', accountAddress)
      if(accountAddress) {
        console.log('flag')
        setNamespaces(getApprovedNamespaces(accountAddress, proposal));
      }
      else
        setNamespaces(undefined);
    }
  }
  

  const onSessionRequest = useCallback((request: Web3WalletTypes.SessionRequest) => {
    console.log(request);
    if(!sessionRequest && !sessionDemand){
      setSessionRequest(request);
      const method = request.params.request.method
      switch (method) {
        case 'eth_sendTransaction':
        case 'eth_signTransaction':
        case 'eth_sendRawTransaction':
          setSessionDemand('Transaction');
          break
        case 'personal_sign':
        case 'eth_sign':
        case 'eth_signTypedData_v4':
        case 'eth_signTypedData':
          setSessionDemand('Signature');
          break
      }
    }
  }, [setSessionDemand, sessionDemand, sessionRequest]);

  const onSessionDelete = useCallback(async (event: any) => {
    console.log('session disconected', event);
    triggerVsaUpdate()
  },[vennWallet])

  useEffect(() => {
    if(walletClient) 
      setVsaProvider(createAccountProvider(walletClient));
    else
      setVsaProvider(undefined);
  }, [walletClient, updater]);

  useEffect(() => {
    // let isCancelled = false;
  
    if (vsaProvider) {
      const resolveAddress = async () => {
        try {
          const address = await vsaProvider.getAddress();
          // if (!isCancelled) {
            setAccountAddress(address);
          // }
        } catch (error) {
          console.error('Error fetching address:', error);
          // Handle error appropriately
        }
      };
      resolveAddress();
    } else
      setAccountAddress(undefined);
    // Cleanup function to set the cancelled flag
    // return () => {
    //   isCancelled = true;
    // };
  }, [vsaProvider]);

  useEffect(() => {
    const resolveWeb3Wallet = async () => {
      try {
        const _wallet = await createWeb3Wallet();
        _wallet.on('session_proposal', event => onSessionProposal(event));
        _wallet.on('session_request', event => onSessionRequest(event));
        _wallet.on('session_delete', event => onSessionDelete(event));
        setVennWallet(_wallet);
      } catch (error: any) {
        console.error('error initializing wallet', error.message);
      }
    }
    resolveWeb3Wallet();
  }, [accountAddress]);

  useEffect(() => {
    setActiveSessions(vennWallet?.getActiveSessions())
  }, [vennWallet, newPairingTopic, updater])

  useEffect(() => {
    if(!activeSessions)
      return
    const sessions = Object.keys(activeSessions)
    if(sessions.length <= 0)
      return
    if(chain && vennWallet)
      emitChainChanged(vennWallet, chain.id);
  }, [newPairingTopic]);
  
  // console.log('supportedChains', supportedChains)
  console.log('chain', chain?.name);
  console.log('accountAddress', accountAddress);
  console.log('eoa', walletClient?.account.address);
  
  
  return (
    <VennSmartAccont.Provider value={{vsaProvider, accountAddress, triggerVsaUpdate}}>
        <VennWalelt.Provider 
        value={{
            vennWallet, setVennWallet,
            sessionProposal, setSessionProposal,
            sessionRequest, setSessionRequest,
            namespaces, setNamespaces,
            sessionDemand, setSessionDemand,
            setNewPairingTopic, updater
        }}>
            {children}
        </VennWalelt.Provider>
    </VennSmartAccont.Provider>
  )
}

// export function useSignIn () {
//   const context = useContext(VennSmartAccont);
  
//   const ret = useCallback(async () => {
//     if(context){
//       context.setSigner(await createWeb3AuthSigner());
//     }
//   }, [context]);
//   return ret;
// }

// export function useSignOut () {
//   const context = useContext(VennSmartAccont);
//   const ret = useCallback(async () => {
//     if(context) {
//       await context.signer?.inner.logout();
//       context.setSigner(null);
//     }
//   }, [context]);
//   return ret;
// }

export function usePair () {
  const context = useContext(VennWalelt);
  return context?.vennWallet?.pair;
}

export function useSmartAccount () {
  const context = useContext(VennSmartAccont);
  const provider = context?.vsaProvider;
  const address = context?.accountAddress;
  return { provider, address };
}

export function useSmartAccountAddress () {
  const context = useContext(VennSmartAccont);
  return context?.accountAddress;
}

export function useVsaUpdate () {
  const context = useContext(VennSmartAccont);
  return context?.triggerVsaUpdate;
}

// export function useSigner () {
//   const context = useContext(VennSmartAccont);
//   return context?.signer;
// }

// export function useSetSigner () {
//   const context = useContext(VennSmartAccont);
//   return context?.setSigner;
// }

export function useVennWallet () {
  const context = useContext(VennWalelt);
  const wallet = context?.vennWallet
  const updater = context?.updater
  return { wallet, updater }
}

export function useSessionProposal () {
  const context = useContext(VennWalelt);
  return context?.sessionProposal
}

export function useNamespaces () {
  const context = useContext(VennWalelt);
  return context?.namespaces;
}

export function useSessionRequest () {
  const context = useContext(VennWalelt);
  return context?.sessionRequest;
}

export function useSessionDemand () {
  const context = useContext(VennWalelt);
  const demandType = context?.sessionDemand;
  let data: any;
  switch(demandType) {
    case 'Connection':
      data = context?.sessionProposal;
      break
    case 'Signature':
    case 'Transaction':
      data = context?.sessionRequest;
      break
  }
  console.log('data in hook', data)
  return { demandType, data }
}

// export function setCurrentSmartAccountProvider (accountProvider: AlchemyProvider) {
//   const context = useContext(VennSmartAccont);
//   if(!context) throw new Error('context called outside scope');
//   context.setVsaProvider(accountProvider);
// }

