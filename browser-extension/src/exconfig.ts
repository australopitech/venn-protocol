import { EVMNetwork } from './pages/Background/types/network';
import dotenv from 'dotenv';
dotenv.config();

const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; //stackup
const networkID = 84531; // base goerli
const network = "Base Goerli";
const provider = 'https://base-goerli.gateway.tenderly.co/6jlPleyGSLqQIAsz1uTkSg';
// const bundler = process.env.BUNDLER_API;
const bundler = 'https://api.stackup.sh/v1/node/486128ebf36d50338aef8803b5517b5696be3cf6174cacf025bc6e3c0c3a66cf'
const factory = "0x470459A74DD5ace425A7bd52c537847DaDeF7F91"; // base goerli

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  enablePasswordEncryption: false,
  showTransactionConfirmationScreen: true,
  factory_address: factory,
  stateVersion: '0.1',
  network: {
    chainID: String(networkID),
    family: 'EVM',
    name: network,
    provider: provider || "https://goerli.base.org/",
    entryPointAddress: entryPointAddress,
    bundler: bundler,
    baseAsset: {
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
      image:
        'https://download.logo.wine/logo/Ethereum/Ethereum-Logo.wine.png',
    },
  } satisfies EVMNetwork,
};
