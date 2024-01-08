import '@/styles/globals.css';
import type { AppProps } from 'next/app';
// import { getDefaultProvider } from 'ethers';
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, baseGoerli } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { newClient } from './client';


const baseTestProvider = process.env.NEXT_PUBLIC_BASE_GOERLI_PROVIDER;
const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
  chains: [baseGoerli, mainnet],
  transports: {
    [baseGoerli.id]: http(),
    [mainnet.id]: http()
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
    )
}
