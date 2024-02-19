'use client'
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { WalletClientSigner } from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Web3Wallet as Web3WalletType } from "@walletconnect/web3wallet/dist/types/client";
import { Web3Wallet, Web3WalletTypes  } from '@walletconnect/web3wallet';
import { Core } from '@walletconnect/core';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'
import { sepolia, baseGoerli, mainnet, polygonMumbai } from "viem/chains";
import { factoryContract } from "@/utils/contractData";
import { VennSmartAccount } from "../../account/account";
import { SessionTypes } from "@walletconnect/types";
import { WalletClient } from "viem";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import { getDefaultEntryPointAddress } from "@alchemy/aa-core";
import { resolveProviderKey } from "../chain-provider";
import { SessionEventType } from "@/types";

type SmartAccountContextType = {
    vsaProvider?: AlchemyProvider;
    accountAddress?: `0x${string}`;
    triggerVsaUpdate: () => void;
};


type WalletContextType = {
  vennWallet?: Web3WalletType;
  setVennWallet: React.Dispatch<React.SetStateAction<Web3WalletType | undefined>>;
  sessionProposal?: Web3WalletTypes.SessionProposal;
  setSessionProposal: React.Dispatch<React.SetStateAction<Web3WalletTypes.SessionProposal | undefined>>;
  sessionRequest?:Web3WalletTypes.SessionRequest;
  setSessionRequest: React.Dispatch<React.SetStateAction<Web3WalletTypes.SessionRequest | undefined>>;
  namespaces?: SessionTypes.Namespaces;
  setNamespaces: React.Dispatch<React.SetStateAction<SessionTypes.Namespaces | undefined>>;
  sessionEvent: SessionEventType | undefined;
  setSessionEvent: React.Dispatch<React.SetStateAction<SessionEventType | undefined>>;
  setNewPairingTopic:React.Dispatch<React.SetStateAction<string | undefined>>;
  updater: boolean;
}
// test
const entryPointAddr = getDefaultEntryPointAddress(baseGoerli);
//
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_BASE_API_KEY;
const factoryAddress = factoryContract.address;
export const activeNetwork = polygonMumbai;


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
    new VennSmartAccount({
        chain,
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


const SmartAccount = createContext<SmartAccountContextType | null>(null);
const Wallet = createContext<WalletContextType | null>(null);

const getApprovedNamespaces = (account: `0x${string}`, proposal: Web3WalletTypes.SessionProposal) => {
  return buildApprovedNamespaces({
    proposal: proposal.params,
    supportedNamespaces: {
      eip155: {
        chains: [`eip155:${mainnet.id}`, `eip155:${polygonMumbai.id}`, `eip155:${sepolia.id}` ],
        methods: [
            'eth_sendTransaction', 'personal_sign', 'eth_sign', 'eth_signTypedData_v4',
            'eth_signTypedData', 'eth_signTransaction', 'eth_sendRawTransaction'
        ],
        events: ['accountsChanged', 'chainChanged'],
        accounts: [`eip155:${mainnet.id}:${account}`,`eip155:${polygonMumbai.id}:${account}`, `eip155:${sepolia.id}:${account}` ]
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

// export function useApproveSessionProposal () {
//   const context = useContext(Wallet);
//   // const { chain } = useNetwork();
//   // console.log('state', context?.sessionProposal, context?.namespaces)
//   return async () => {
//     if(context && context.sessionProposal && context.namespaces ){
//       try {
//         await context.vennWallet?.approveSession({
//           id: context.sessionProposal.id,
//           namespaces: context.namespaces
//         });
//         context.setNewPairingTopic(context.sessionProposal.params.pairingTopic);
//       } catch (error: any) {
//         console.error(error)
//         // alert(error.message);
//       } 
//     } else 
//         throw new Error ('missing context: check state for session proposal and namespaces');
//     context?.setSessionProposal(undefined);
//     context?.setNamespaces(undefined);
//     context?.setSessionEvent(undefined);
//   }
// }

// export function useRejectSessionProposal () {
//   const context = useContext(Wallet);
//   return async () => {
//     if(context && context.sessionProposal) {
//       try {
//         await context.vennWallet?.rejectSession({
//           id: context.sessionProposal?.id,
//           reason: getSdkError("USER_REJECTED")
//         });
//       } catch (error: any) {
//         console.error(error);
//       }
//     } else
//       throw new Error('missing context: check state for session proposal and namespaces');
//     context?.setSessionProposal(undefined);
//     context?.setNamespaces(undefined);
//     context?.setSessionEvent(undefined);
//   }
// }



// export function useApproveSessionRequest () {
//   const walletContext = useContext(Wallet);
//   const vsaContext = useContext(SmartAccount);  
//   return async () => {
//     if(walletContext?.sessionRequest) {
//       let ret: any;
//       let response: any;
//       const { id, topic } = walletContext.sessionRequest
//       if(vsaContext?.vsaProvider) {
//         try {
//           let { method, params } = walletContext.sessionRequest.params.request;
//           params = formatParams(method, params);
//           ret = await vsaContext.vsaProvider.request({ method, params });
//           response = formatJsonRpcResult(id, ret);
//           await walletContext.vennWallet?.respondSessionRequest({
//               topic,
//               response
//           });
//         } catch (error: any) {
//           console.error(error);
//           // alert(error.message);
//           response = formatJsonRpcError(id, error.message);
//           await walletContext.vennWallet?.respondSessionRequest({
//               topic,
//               response
//           });
//         } finally {
//           walletContext.setSessionRequest(undefined);
//           walletContext.setSessionEvent(undefined);
//           return ret;
//         }
//       } else {
//           response = formatJsonRpcError(id, getSdkError("USER_DISCONNECTED").message);
//           try {
//             await walletContext.vennWallet?.respondSessionRequest({
//               topic,
//               response
//             });
//           } catch(error: any) {
//             console.error(error);
//             alert(error.message);
//           } finally {
//             walletContext.setSessionRequest(undefined);
//             walletContext.setSessionEvent(undefined);
//           }
//       }
//     } else {
//       throw new Error ('missing context: check wallet provider');
//     }
//   }
// }


// export function useRejectSessionRequest() {
//   const context = useContext(Wallet);
//   return async () => {
//     if(context?.sessionRequest) {
//       // console.log('using reject');
//       try {
//         const response = formatJsonRpcError(
//           context.sessionRequest.id,
//           getSdkError('USER_REJECTED').message
//         );
//         console.log('responding...');
//         await context.vennWallet?.respondSessionRequest({
//           topic: context.sessionRequest.topic,
//           response
//         });
//       } catch (error: any) {
//         console.error(error);
//         // alert(error.message);
//       } finally {
//         // console.log('reset provider state');
//         context.setSessionRequest(undefined);
//         context.setSessionEvent(undefined);
//       }
//     }
//   }
// }

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
  const [sessionEvent, setSessionEvent] = useState<SessionEventType>();
  const [newPairingTopic, setNewPairingTopic] = useState<any>();
  const [activeSessions, setActiveSessions] = useState<any>();
  const { chain } = useNetwork();

  const { connector } = useAccount()

  const triggerVsaUpdate = useCallback(() => {
    setUpdater(!updater);
  }, [updater, setUpdater]);

  const onSessionProposal = (proposal: Web3WalletTypes.SessionProposal) => {
    console.log('session_proposal', proposal);
    // console.log('state', sessionProposal, sessionEvent)
    if(!sessionProposal && !sessionEvent){
      setSessionProposal(proposal);
      setSessionEvent('Connection');
      if(accountAddress) {
        setNamespaces(getApprovedNamespaces(accountAddress, proposal));
      }
      else
        setNamespaces(undefined);
    }
  }
  

  const onSessionRequest = (request: Web3WalletTypes.SessionRequest) => {
    console.log('session_request', request);
    if(!sessionRequest && !sessionEvent){
      setSessionRequest(request);
      const method = request.params.request.method
      switch (method) {
        case 'eth_sendTransaction':
        case 'eth_signTransaction':
        case 'eth_sendRawTransaction':
          setSessionEvent('Transaction');
          break
        case 'personal_sign':
        case 'eth_sign':
        case 'eth_signTypedData_v4':
        case 'eth_signTypedData':
          setSessionEvent('Signature');
          break
      }
    }
  };

  const onSessionDelete = async (event: any) => {
    console.log('session_delete', event);
    triggerVsaUpdate()
  }

  useEffect(() => {
    if(walletClient) {
      if(connector?.id === "web3auth")
        setVsaProvider(createAccountProvider(walletClient));
      else
      setVsaProvider(undefined);  
    }
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
  // console.log('chain', chain?.name);
  // console.log('accountAddress', accountAddress);
  // console.log('eoa', walletClient?.account.address);
  
  
  return (
    <SmartAccount.Provider value={{vsaProvider, accountAddress, triggerVsaUpdate}}>
        <Wallet.Provider 
        value={{
            vennWallet, setVennWallet,
            sessionProposal, setSessionProposal,
            sessionRequest, setSessionRequest,
            namespaces, setNamespaces,
            sessionEvent, setSessionEvent,
            setNewPairingTopic, updater
        }}>
            {children}
        </Wallet.Provider>
    </SmartAccount.Provider>
  )
}

// export function useSignIn () {
//   const context = useContext(SmartAccount);
  
//   const ret = useCallback(async () => {
//     if(context){
//       context.setSigner(await createWeb3AuthSigner());
//     }
//   }, [context]);
//   return ret;
// }

// export function useSignOut () {
//   const context = useContext(SmartAccount);
//   const ret = useCallback(async () => {
//     if(context) {
//       await context.signer?.inner.logout();
//       context.setSigner(null);
//     }
//   }, [context]);
//   return ret;
// }

export function usePair () {
  const context = useContext(Wallet);
  return context?.vennWallet?.pair;
}

export function useSmartAccount () {
  const context = useContext(SmartAccount);
  const provider = context?.vsaProvider;
  const address = context?.accountAddress;
  return { provider, address };
}

export function useSmartAccountAddress () {
  const context = useContext(SmartAccount);
  return context?.accountAddress;
}

export function useVsaUpdate () {
  const context = useContext(SmartAccount);
  return context?.triggerVsaUpdate;
}

// export function useSigner () {
//   const context = useContext(SmartAccount);
//   return context?.signer;
// }

// export function useSetSigner () {
//   const context = useContext(SmartAccount);
//   return context?.setSigner;
// }

export function useVennWallet () {
  const context = useContext(Wallet);
  const wallet = context?.vennWallet
  const updater = context?.updater
  const stateResetter = useWalletStateResetter();
  return { wallet, updater, stateResetter }
}

export function useSessionProposal () {
  const context = useContext(Wallet);
  return context?.sessionProposal
}

export function useNamespaces () {
  const context = useContext(Wallet);
  return context?.namespaces;
}

export function useSessionRequest () {
  const context = useContext(Wallet);
  return context?.sessionRequest;
}

export function useSessionEvent () {
  const context = useContext(Wallet);
  const event = context?.sessionEvent;
  let data: any;
  switch(event) {
    case 'Connection':
      const sessionProposal = context?.sessionProposal;
      const namespaces = context?.namespaces;
      data = { sessionProposal, namespaces };
      break
    case 'Signature':
    case 'Transaction':
      data = context?.sessionRequest;
      break
  }
  return { event, data }
}

export function useWalletStateResetter () {
  const context = useContext(Wallet);
  return (event: 'proposal' | 'request') => {
    switch(event) {
      case 'proposal':
        context?.setSessionProposal(undefined);
        context?.setNamespaces(undefined);
        context?.setSessionEvent(undefined);
        break
      case 'request':
        context?.setSessionRequest(undefined);
        context?.setSessionEvent(undefined);
    }
  }
}

// export function setCurrentSmartAccountProvider (accountProvider: AlchemyProvider) {
//   const context = useContext(SmartAccount);
//   if(!context) throw new Error('context called outside scope');
//   context.setVsaProvider(accountProvider);
// }

