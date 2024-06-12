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
import { ApproveData, OnApproveArgs, SessionEventType, TxResolved, WalletDialogType } from "@/types";
import ApproveDialog from "@/components/common/approve-dialog/approve-dialog";
import { ConnectDialog } from "@/components/common/wallet-action-dialog/connect";
import { disconnectSession, rejectSessionProposal, rejectSessionRequest, resolveApprovalExternal, resolveApprovalInternal } from "./wallet";
import WalletActionDialog from "@/components/common/wallet-action-dialog/wallet-action-dialog";

const mockRequest = {
  id: 1718045834967356,
  params: {
      chainId: "eip155:11155111",
      request: {
          method: "eth_sendTransaction",
          params: [{
              data: "0xd0e30db0",
              from: "0xb0a2ddf528718f22258839dba892a0828c6705a0",
              gas: "0xb16a",
              value: "0x38d7ea4c68000"
          }]
      },
  },
  topic: "47ac37eb5430a5eef9dfdbbd6f0167640c322a93fc94507165fdbadf254e1e7d",
  verifyContext: {
      verified: {
          origin: "https://app.uniswap.org",
          validation: "UNKNOWN"
      }
  }
}

type SmartAccountContextType = {
  vsaProvider?: AlchemyProvider;
  accountAddress?: `0x${string}`;
  stateUpdater: () => void;
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
  stateUpdate: boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenConnect: React.Dispatch<React.SetStateAction<boolean>>;
  activeSessions?: any;
  approveData?: ApproveData;
  setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>;
}
// test
const entryPointAddr = getDefaultEntryPointAddress(baseGoerli);
//
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
// const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_BASE_API_KEY;
const factoryAddress = factoryContract.address;
export const activeNetwork = sepolia;


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
        chains: [`eip155:${mainnet.id}`, `eip155:${sepolia.id}` ],
        methods: [
            'eth_sendTransaction', 'personal_sign', 'eth_sign', 'eth_signTypedData_v4',
            'eth_signTypedData', 'eth_signTransaction', 'eth_sendRawTransaction'
        ],
        events: ['accountsChanged', 'chainChanged'],
        accounts: [`eip155:${mainnet.id}:${account}`, `eip155:${sepolia.id}:${account}` ]
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
  const [stateUpdate, setStateUpdate] = useState(false);
  const [sessionEvent, setSessionEvent] = useState<SessionEventType>();
  const [approveData, setApproveData] = useState<ApproveData>();
  const [newPairingTopic, setNewPairingTopic] = useState<any>();
  const [activeSessions, setActiveSessions] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { chain } = useNetwork();
  const [openConnect, setOpenConnect] = useState(false);
  const [error, setError] = useState<any>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hash, setHash] = useState<string>();

  const { connector } = useAccount()

  const stateUpdater = useCallback(() => {
    setStateUpdate(!stateUpdate);
  }, [stateUpdate, stateUpdate]);

  const onSessionProposal = (proposal: Web3WalletTypes.SessionProposal) => {
    console.log('session_proposal', proposal);
    console.log('state onSessionProposal', sessionProposal, sessionEvent)
    if(!sessionProposal && !sessionEvent){
      console.log('setting state onSessionProposal')
      setIsLoading(true)
      setSessionProposal(proposal);
      setSessionEvent('Connection');
      console.log('accountAddress state', accountAddress);
      if(accountAddress) {
        console.log('setting namesmapces state')
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
    stateUpdater();
  }

  const onConnect = async (uri: string) => {
    if(isLoading)
      return
    try {
      vennWallet?.pair({ uri, activatePairing: true });
    } catch (err: any) {
      alert(err.message);
    }
  }

  const onApproveExternal = async (eventType: 'proposal' | 'request') => {
    setIsProcessing(true);
    if(!vennWallet) {
      setError({ message: 'no wallet found'});
      setIsProcessing(false);
      walletStateResetter('proposal');
      return
    }
    if(eventType === 'proposal'){      
      if(!sessionProposal || !sessionEvent || !namespaces) {
        setError({ message: 'missing session event metadata' });
        console.error('missing session event metadata')
        setIsProcessing(false);
        walletStateResetter('proposal');
        return
    }} else {
      if(!sessionRequest || !sessionEvent) {
        setError({ message: 'missing session event metadata' });
        console.error('missing session event metadata')
        setIsProcessing(false);
        walletStateResetter('request');
        return
    }}
    const { hash, error: err } = await resolveApprovalExternal(
      sessionEvent,
      eventType === 'proposal' ? { sessionProposal, namespaces} : sessionRequest,
      walletStateResetter,
      vennWallet,
      vsaProvider
    )
    console.error(err);
    setError(err);
    setHash(hash);
    setIsProcessing(false);
    stateUpdater();
  }

  const onApproveInternal = async () => {
    setIsProcessing(true);
    if(!vsaProvider) {
      console.error('missing provider');
      setError({ message: 'missing provider' });
      walletStateResetter();
      return
    }
    if(!approveData) {
      console.error('missing transaction metadata');
      setError({ message: 'missing transaction metadata' });
      walletStateResetter();
      return
    }
    const { hash, error } = await resolveApprovalInternal(approveData.data, vsaProvider)
    setError(error);
    setHash(hash);
    walletStateResetter();
    setIsProcessing(false);
  }

  const onApprove = async (args: OnApproveArgs) => {
    args.type === 'internal'
     ? await onApproveInternal()
     : await onApproveExternal(args.eventType)
  }

  const onReject = async (eventType: 'proposal' | 'request') => {
    setIsProcessing(true);
    if(eventType === 'proposal') {
      try {
        await rejectSessionProposal(
          { sessionProposal },
          walletStateResetter,
          vennWallet
        )
      } catch (err) {
        setError(err)
      }
      setIsProcessing(false)
      walletStateResetter('proposal')
    } else {
      try {
        await rejectSessionRequest(
          sessionRequest,
          walletStateResetter,
          vennWallet
        )
      } catch (err) {
        setError(err)
      }
      setIsProcessing(false)
      walletStateResetter('request');
    }

  }
   

  const walletStateResetter = (eventType?: 'proposal' | 'request') => {
    switch(eventType) {
      case 'proposal':
        setSessionProposal(undefined);
        setNamespaces(undefined);
        setSessionEvent(undefined);
        setApproveData(undefined);
        setIsLoading(false);
        break
      case 'request':
        setSessionRequest(undefined);
        setSessionEvent(undefined);
        setApproveData(undefined)
      default:
        setApproveData(undefined);
    }
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
  }, [walletClient, stateUpdate]);

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
  }, [vennWallet, newPairingTopic, stateUpdate])

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
  
  const onCloseDialog = (type?: WalletDialogType) => {
    switch(type) {
      case 'connect':
        setOpenConnect(false);
        break;
      case 'error':
        setError(undefined);
        break;
      case 'txResolved':
        setHash(undefined);
        break;
      default:
        setApproveData(undefined);
    }
  }
  
  return (
    <SmartAccount.Provider value={{vsaProvider, accountAddress, stateUpdater}}>
        <Wallet.Provider 
        value={{
            vennWallet, setVennWallet,
            sessionProposal, setSessionProposal,
            sessionRequest, setSessionRequest,
            namespaces, setNamespaces,
            sessionEvent, setSessionEvent,
            setNewPairingTopic, stateUpdate,
            isLoading, setIsLoading,
            setOpenConnect,
            activeSessions,
            approveData, setApproveData
        }}>
            <>
            {(openConnect || sessionEvent || error || hash || isProcessing) &&
            <WalletActionDialog
            address={accountAddress}
            close={onCloseDialog}
            isProcessing={isProcessing}
            error={error}
            hash={hash}
            openConnect={openConnect}
            isLoading={isLoading}
            approveData={approveData}
            onConnect={onConnect}
            onApprove={onApprove}
            onReject={onReject}
            />
            }
            {children}
            </>
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
  const pair = context?.vennWallet?.pair;
  const isLoading = context?.isLoading
  return { pair, isLoading }
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
  return context?.stateUpdater;
}

// export function useSigner () {
//   const context = useContext(SmartAccount);
//   return context?.signer;
// }

// export function useSetSigner () {
//   const context = useContext(SmartAccount);
//   return context?.setSigner;
// }

export function useOpenConnect () {
  const context = useContext(Wallet);
  return context?.setOpenConnect
}

export function useActiveSessions () {
  const context = useContext(Wallet);
  const updater = useVsaUpdate();
  const disconnect = async (topic: any) => {
    await disconnectSession(topic, context?.vennWallet);
    if(updater) updater();
  }
  const activeSessions = context?.activeSessions;
  return { activeSessions, disconnect }
}

export function useVennWallet () {
  const context = useContext(Wallet);
  const wallet = context?.vennWallet
  const updater = context?.stateUpdate
  const stateResetter = useWalletStateResetter();
  return { wallet, updater, stateResetter }
}


export function useApproveData () {
  const context = useContext(Wallet);
  const data = context?.approveData;
  const setApproveData = context?.setApproveData;
  return { data, setApproveData }
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
        context?.setIsLoading(false);
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

