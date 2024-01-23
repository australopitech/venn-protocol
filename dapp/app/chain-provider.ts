import { sepolia, baseGoerli, polygonMumbai } from "viem/chains"
import { chains } from "./wagmi";

// const supportedChains = [baseGoerli.id, polygonMumbai.id];

const providerKey: { [index: number]: string | undefined } = {
    [sepolia.id]: process.env.NEXT_PUBLIC_SEPOLIA_ALCHEMY_API_KEY,
    [baseGoerli.id]: process.env.NEXT_PUBLIC_BASE_GOERLI_ALCHEMY_API_KEY,
    [polygonMumbai.id]: process.env.NEXT_PUBLIC_MUMBAI_ALCHEMY_API_KEY
}

export const resolveProviderKey = (chainId: number) => {
    console.log('apikey response', providerKey[chainId] )
    return providerKey[chainId];
}

