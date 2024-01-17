import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter, OPENLOGIN_NETWORK } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";

const name = "Venn Smart Wallet";
const iconUrl = "https://github.com/pbfranceschin/wallet-connect-test/blob/master/app/android-chrome-192x192.png";

//@ts-ignore
export const rainbowWeb3AuthConnector = ({ chains }) => {
  // Create Web3Auth Instance
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x" + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0].blockExplorers?.default.url[0],
  }

  const web3AuthInstance = new Web3AuthNoModal({
    clientId: "BEladcxiN547-jOdKsH6udt5ghJMymep8ZtuP_p3gLRcAtjxGgp2SzDUeJKv8CWDifXYJ5cMAVyi6C1O9s-44cE",
    chainConfig,
    web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
  });

  // Add openlogin adapter for customisations
  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  const connector = new Web3AuthConnector({
    chains: chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider: 'google',
      },
    },
  });

  return ({
    id: "web3auth",
    name,
    iconUrl,
    iconBackground: "#fff",
    createConnector: () => {
      return {
        connector,
      };
    },
  })
};