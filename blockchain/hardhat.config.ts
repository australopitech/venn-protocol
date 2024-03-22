import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import { HardhatUserConfig } from 'hardhat/config'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-etherscan'
import 'solidity-coverage'
import * as fs from 'fs'

import dotenv from 'dotenv';
dotenv.config();

const POLYGONSCAN_API_KEY = "DM99R4ISY34BS8U8HBQ7NWFMMDCPSUR4W9";


const mnemonicFileName = process.env.MNEMONIC_FILE ?? `${process.env.HOME}/.secret/testnet-mnemonic.txt`
let mnemonic = 'test '.repeat(11) + 'junk'
if (fs.existsSync(mnemonicFileName)) { mnemonic = fs.readFileSync(mnemonicFileName, 'ascii') }

function getNetwork1 (url: string): { url: string, accounts: { mnemonic: string } } {
  return {
    url,
    accounts: { mnemonic }
  }
}

function getNetwork (name: string): { url: string, accounts: { mnemonic: string } } {
  return getNetwork1(`https://${name}.infura.io/v3/${process.env.INFURA_ID}`)
  // return getNetwork1(`wss://${name}.infura.io/ws/v3/${process.env.INFURA_ID}`)
}

const optimizedComilerSettings = {
  version: '0.8.17',
  settings: {
    optimizer: { enabled: true, runs: 1000000 },
    viaIR: true
  }
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{
      version: '0.8.15',
      settings: {
        optimizer: { enabled: true, runs: 1000000 }
      }
    }],
    overrides: {
      'contracts/core/EntryPoint.sol': optimizedComilerSettings,
      'contracts/samples/SimpleAccount.sol': optimizedComilerSettings
    }
  },
  networks: {
    dev: { url: 'http://localhost:8545' },
    // github action starts localgeth service, for gas calculations
    localgeth: { url: 'http://localgeth:8545' },
    goerli: getNetwork('goerli'),
    // sepolia: getNetwork('sepolia'),
    proxy: getNetwork1('http://localhost:8545'),
    sepolia: {
      chainId: 11155111,
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.SEPOLIA_ALCHEMY_API_KEY}`,
      accounts: [`${process.env.DUMMY_2_PRIVATE_KEY}`]
    },
    // base: {
    //   chainId: 8453,
    //   // url: process.env.BASE_PROVIDER,
    //   accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`]
    // },
    base_goerli: {
      chainId: 84531,
      url: `https://base-goerli.g.alchemy.com/v2/${process.env.BASE_GOERLI_ALCHEMY_API_KEY}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`]
    },

    polygon_mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_ALCHEMY_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`]      
    }
  },

  namedAccounts: {
    deployer: {
      default: 0,
      // sepolia: `${process.env.PUBLIC_KEY}`,
    }
  },

  mocha: {
    timeout: 10000
  },

  etherscan: {
   apiKey: POLYGONSCAN_API_KEY,
  }
//    customChains: [
//      {
//        network: "base-goerli",
//        chainId: 84531,
//        urls: {
//         apiURL: "https://api-goerli.basescan.org/api",
//         browserURL: "https://goerli.basescan.org"
//        }
//      }
//    ]
//  },

}

// coverage chokes on the "compilers" settings
if (process.env.COVERAGE != null) {
  // @ts-ignore
  config.solidity = config.solidity.compilers[0]
}

export default config
