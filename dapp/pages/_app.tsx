import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { getDefaultProvider } from 'ethers';
import { 
  Mainnet, DAppProvider,Config, Goerli, BaseGoerli, Base,
  MetamaskConnector, CoinbaseWalletConnector } from '@usedapp/core';
import { WalletConnectConnector } from '@usedapp/wallet-connect-connector';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const baseTestProvider = process.env.BASE_GOERLI_PROVIDER
const provider = new ethers.providers.JsonRpcProvider(
  baseTestProvider? baseTestProvider 
  : "https://goerli.base.org/"
);

const config: Config = {
  readOnlyChainId: BaseGoerli.chainId,
  readOnlyUrls: {
    [BaseGoerli.chainId]: provider,
    // [Mainnet.chainId]: getDefaultProvider('mainnet'),
    // [Goerli.chainId]: getDefaultProvider('goerli'),
  },
  networks: [BaseGoerli, Base],
  connectors: {
    metamask: new MetamaskConnector(),
    coinbase: new CoinbaseWalletConnector(),
    walletConnect: new WalletConnectConnector({ infuraId: 'd8df2cb7844e4a54ab0a782f608749dd' })
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
    )
}
