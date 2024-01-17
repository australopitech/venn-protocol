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
import { baseGoerli } from "viem/chains";
import { factoryContract } from "@/utils/contractData";
import { createWeb3AuthSigner } from "@/utils/web3auth";
import { SessionTypes } from "@walletconnect/types";
import { formatParams } from "@/utils/utils";
import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { WalletClient } from "viem";
import { useWalletClient } from "wagmi";


type VennSmartAccountContextType = {
    vsaProvider?: AlchemyProvider;
    accountAddress?: `0x${string}`;
    triggerVsaUpdate: () => void;
};

type SessionDemandType = 'Connection'|'Transaction'|'Signature';

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
}

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_BASE_API_KEY;
const activeNetwork = baseGoerli;
const factoryAddress = factoryContract.address;
// const supportedChains = [baseGoerli];


const createAccountProvider = (walletClient: WalletClient) => {
  if(!apiKey) throw new Error("missing api key");
  const signer = new WalletClientSigner(walletClient, "json-rpc");
  return new AlchemyProvider({
    apiKey,
    chain: activeNetwork
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
        chains: [`eip155:${baseGoerli.id}`],
        methods: [
            'eth_sendTransaction', 'personal_sign', 'eth_sign', 'eth_signTypedData_v4',
            'eth_signTypedData', 'eth_signTransaction', 'eth_sendRawTransaction'
        ],
        events: ['accountsChanged', 'chainChanged'],
        accounts: [`eip155:${baseGoerli.id}:${account}`]
      }
    }
  });
}

export function useApproveSessionProposal () {
  return useCallback(async () => {
    const context = useContext(VennWalelt);
    if(context && context.sessionProposal && context.namespaces ){
      try {
        await context.vennWallet?.approveSession({
          id: context.sessionProposal?.id,
          namespaces: context.namespaces
        })
      } catch (error: any) {
        console.log(error)
        alert(error.message);
      }
    } else 
        console.error('missing context: check state for session proposal and namespaces');
    context?.setSessionProposal(undefined);
    context?.setNamespaces(undefined);
    context?.setSessionDemand(undefined);
  },[VennWalelt]);
}

export function useRejectSessionProposal () {
  return useCallback(async () => {
    const context = useContext(VennWalelt);
    if(context && context.sessionProposal) {
      await context.vennWallet?.rejectSession({
        id: context.sessionProposal?.id,
        reason: getSdkError("USER_REJECTED")
      });
    } else
      console.error('missing context: check state for session proposal and namespaces');
    context?.setSessionProposal(undefined);
    context?.setNamespaces(undefined);
    context?.setSessionDemand(undefined);
  },[VennWalelt]);
}

export function useApproveSessionRequest () {
    return useCallback(async () => {
      const walletContext = useContext(VennWalelt);
      const vsaContext = useContext(VennSmartAccont);
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
              alert(error.message);
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
              try{
                  await walletContext.vennWallet?.respondSessionRequest({
                    topic,
                    response
                  });
              } catch(error: any) {
                  console.error(error);
                  alert(error.message);
              }
          }
      }
    }, [VennWalelt, VennSmartAccont])
}

export function useRejectSessionRequest() {
  return useCallback(async () => {
    const context = useContext(VennWalelt);
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
        alert(error.message);
      } finally {
        context.setSessionRequest(undefined);
        context.setSessionDemand(undefined);
      }
    }
  }, [VennWalelt]);
}

export function VennAccountProvider ({children} : {children : React.ReactNode}) {
  // const [signer, setSigner] = useState<Web3AuthSigner | null>(null);
  const { data: walletClient } = useWalletClient();
  const [vsaProvider, setVsaProvider] = useState<AlchemyProvider>();
  const [accountAddress, setAccountAddress] = useState<`0x${string}`>();
  const [vennWallet, setVennWallet] = useState<Web3WalletType>();
  const [sessionProposal, setSessionProposal] = useState<Web3WalletTypes.SessionProposal>();
  const [sessionRequest, setSessionRequest] = useState<Web3WalletTypes.SessionRequest>();
  const [namespaces, setNamespaces] = useState<SessionTypes.Namespaces>();
  const [updater, setUpdater] = useState(false);
  const [sessionDemand, setSessionDemand] = useState<SessionDemandType>();

  const triggerVsaUpdate = useCallback(() => {
    setUpdater(!updater);
  }, [updater, setUpdater])
  
  const onSessionProposal = useCallback((proposal: Web3WalletTypes.SessionProposal) => {
    if(!sessionProposal && !sessionDemand){
      setSessionProposal(proposal);
      setSessionDemand('Connection');
      if(accountAddress)
        setNamespaces(getApprovedNamespaces(accountAddress, proposal));
      else
        setNamespaces(undefined);
    }
  }, [accountAddress, setNamespaces, setSessionProposal]);
  
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
  }, [setSessionDemand]);

  const onSessionDelete = useCallback((event: any) => {
    console.log('session disconected', event);
  },[])

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
        setVennWallet(await createWeb3Wallet());   
      } catch (error: any) {
        console.error('error initializing wallet', error.message);  
      }
    }
    resolveWeb3Wallet();
  }, []);

  useEffect(() => {
    if(vennWallet) {
      vennWallet.on('session_proposal', event => onSessionProposal(event));
      vennWallet.on('session_request', event => onSessionRequest(event));
      vennWallet.on('session_delete', onSessionDelete);
    }
  }, [vennWallet]);
  
  console.log('inside provider', walletClient)
  
  return (
    <VennSmartAccont.Provider value={{vsaProvider, accountAddress, triggerVsaUpdate}}>
        <VennWalelt.Provider 
        value={{
            vennWallet, setVennWallet,
            sessionProposal, setSessionProposal,
            sessionRequest, setSessionRequest,
            namespaces, setNamespaces,
            sessionDemand, setSessionDemand
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

export async function pair (uri: string) {
  const context = useContext(VennWalelt);
  if(!context)
    throw new Error('context called outside scope');

  await context.vennWallet?.core.pairing.pair({ uri });
}

export function useSmartAccountProvider () {
  const context = useContext(VennSmartAccont);
  return context?.vsaProvider;
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
  return context?.vennWallet
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
    case 'Signature':
    case 'Transaction':
      data = context?.sessionRequest;
  }
  return { demandType, data }
}

// export function setCurrentSmartAccountProvider (accountProvider: AlchemyProvider) {
//   const context = useContext(VennSmartAccont);
//   if(!context) throw new Error('context called outside scope');
//   context.setVsaProvider(accountProvider);
// }

