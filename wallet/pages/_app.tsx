import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { getDefaultProvider } from 'ethers';
import { Mainnet, DAppProvider, Config, Goerli, BaseGoerli } from '@usedapp/core'
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const baseTestProvider = process.env.BASE_GOERLI_PROVIDER
const provider = new ethers.providers.JsonRpcProvider(baseTestProvider);

export const config: Config = {
  readOnlyChainId: BaseGoerli.chainId,
  readOnlyUrls: {
    // [BaseGoerli.chainId]: provider,
    [Mainnet.chainId]: getDefaultProvider('mainnet'),
    [Goerli.chainId]: getDefaultProvider('goerli'),
  },
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
    )
}
