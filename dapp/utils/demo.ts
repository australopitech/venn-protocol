import { createPublicClient, createWalletClient, getAddress, http, isAddress, parseEther, encodeFunctionData } from "viem"
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { mockNftContract } from "./contractData";
import { WalletClient } from "wagmi";

// const mockNftContractAddr = getAddress(mockNftContract.address);
// const mockNftContractAbi = mockNftContract.abi;

const mockNftContractAddr = getAddress(mockNftContract.address);
const mockNftContractAbi = mockNftContract.abi;

export function getTestNftContractAddress() {
  return mockNftContractAddr;
}

const funder = createWalletClient({
    account: privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY}`),
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_SEPOLIA_ALCHEMY_API_KEY}`)
});

const client = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_SEPOLIA_ALCHEMY_API_KEY}`)
})

export const faucetDrip = async (account: string) => {
  if(!isAddress(account)) throw new Error('invalid account address');
  const hash = await funder.sendTransaction({
    to: account,
    value: parseEther("0.1"),
    data: '0x'
  });
  await client.waitForTransactionReceipt({ hash });
  return hash
}

export const mintMockNFT = async (to: string) => {
  if(!isAddress(to)) throw new Error('invalid account address');
  const hash = await funder.sendTransaction({
    to: mockNftContractAddr,
    data: mintCallData(to, testNftUri)
  });
  await client.waitForTransactionReceipt({ hash });
  return hash;
}

export const burnMockNFT = async (signer: WalletClient, tokenId: bigint) => {
  const hash = await signer.sendTransaction({
    to: mockNftContractAddr,
    data: burnCallData(tokenId)
  });
  await client.waitForTransactionReceipt({ hash });
  return hash;
}

const testNftUri = "https://ipfs.filebase.io/ipfs/QmYmnnJmnJQgtwZw7pVx5kCyncpSz1mt9fGeKG1b4YxrZH";


function mintCallData (
  to: string,
  uri: string,
) {
  return encodeFunctionData({
      abi: mockNftContractAbi,
      functionName: 'safeMint',
      args: [to, uri]
  });
}

function burnCallData (
  tokenId: bigint
) {
  return encodeFunctionData({
      abi: mockNftContractAbi,
      functionName: 'burn',
      args: [ tokenId ]
  });
}