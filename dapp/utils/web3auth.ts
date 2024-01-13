import { Web3AuthSigner } from "@alchemy/aa-signers/web3auth";

const clientId = 'BEladcxiN547-jOdKsH6udt5ghJMymep8ZtuP_p3gLRcAtjxGgp2SzDUeJKv8CWDifXYJ5cMAVyi6C1O9s-44cE';

export const createWeb3AuthSigner = async () => {
  let signer: Web3AuthSigner | null;
  try {
    const signer_ = new Web3AuthSigner({
        clientId: clientId,
        uiConfig:{
          appName: "Venn smart",
          theme: {
            primary: "pink"
          },
          mode: "light",
          logoLight: "https://github.com/pbfranceschin/wallet-connect-test/blob/master/app/android-chrome-192x192.png",
          logoDark: "https://github.com/pbfranceschin/wallet-connect-test/blob/master/app/android-chrome-192x192.png",
        },
        web3AuthNetwork: "sapphire_devnet",
        chainConfig: {
          chainNamespace: "eip155"
        },
    });

    await signer_.authenticate({
        init: async () => {
          await signer_.inner.initModal();
        },
        connect: async () => {
          await signer_.inner.connect();
        }
    });

    signer = signer_;
    
  } catch (error: any) {
    console.error(error.message);
    signer = null;
  }

  return signer;
}