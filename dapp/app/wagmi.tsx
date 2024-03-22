'use client'

import { createConfig, configureChains, WagmiConfig } from 'wagmi';
import { mainnet, sepolia, baseGoerli, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultWallets, lightTheme, RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { rainbowWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import React from 'react';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { rainbowWeb3AuthConnector } from './rainbowkit-w3a-connector.';


const baseTestProvider = process.env.NEXT_PUBLIC_BASE_GOERLI_PROVIDER;
const projectId = '7029fcb544dedd8f2a0d1fa0135cc597';
// const queryClient = new QueryClient();

export const { chains, publicClient} = configureChains(
  [sepolia],
  [
    // jsonRpcProvider({rpc: (chain) => ({http: baseTestProvider ?? ''})}),
    publicProvider()
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      rainbowWeb3AuthConnector({ chains }),
      rainbowWallet({ projectId, chains }),
      metaMaskWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export default function WagmiProvider({children}: { children : React.ReactNode}) {
    return (
      <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} theme={lightTheme({accentColor: '#FFB6C1', accentColorForeground: 'white', overlayBlur: 'small'})}>
            {children}
          </RainbowKitProvider>
      </WagmiConfig>
      )
}