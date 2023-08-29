import { EVMNetwork } from './pages/Background/types/network';
import dotenv from 'dotenv';
dotenv.config();

const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; //stackup
const networkID = 84531; // base goerli
const network = "Base Goerli";
const provider = process.env.BASE_GOERLI_PROVIDER;
const bundler = process.env.BUNDLER_API;
const factory = "0x684705F4A1C7cF696aD45e62Ea9E28e37a94b530"; // base goerli

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
    provider: provider || "https://mainnet.base.org/",
    entryPointAddress: entryPointAddress,
    bundler: bundler,
    baseAsset: {
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
      image:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
  } satisfies EVMNetwork,
};
