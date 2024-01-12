import '@/styles/globals.css';
import type { AppProps } from 'next/app';
// import { getDefaultProvider } from 'ethers';
import { createConfig, configureChains, WagmiConfig } from 'wagmi';
import { mainnet, sepolia, baseGoerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';


const baseTestProvider = process.env.NEXT_PUBLIC_BASE_GOERLI_PROVIDER;
const projectId = '7029fcb544dedd8f2a0d1fa0135cc597';
// const queryClient = new QueryClient();

const { chains, publicClient} = configureChains(
  [baseGoerli],
  [
    // jsonRpcProvider({rpc: (chain) => ({http: baseTestProvider ?? ''})}),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Venn',
  projectId,
  chains
});

export const wagmiConfig = createConfig({
  connectors,
  publicClient
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={lightTheme({accentColor: '#FFB6C1', accentColorForeground: 'white', overlayBlur: 'small'})}>
          <Component {...pageProps} />
        </RainbowKitProvider>
    </WagmiConfig>
    )
}
