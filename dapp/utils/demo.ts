import { createPublicClient, createWalletClient, getAddress, http, isAddress, parseEther, encodeFunctionData } from "viem"
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";
import { mockNftContract, testNftContract } from "./contractData";
import { WalletClient } from "wagmi";

// const mockNftContractAddr = getAddress(mockNftContract.address);
// const mockNftContractAbi = mockNftContract.abi;

const testNftContractAddr = getAddress(testNftContract.address);
const testNftContractAbi = testNftContract.abi;

export function getTestNFTcontractAddress() {
  return testNftContractAddr;
}

const funder = createWalletClient({
    account: privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY}`),
    chain: polygonMumbai,
    transport: http(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_MUMBAI_ALCHEMY_API_KEY}`)
});

const client = createPublicClient({
  chain: polygonMumbai,
  transport: http(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_MUMBAI_ALCHEMY_API_KEY}`)
})

export const faucetDrip = async (account: string) => {
  if(!isAddress(account)) throw new Error('invalid account address');
  const hash = await funder.sendTransaction({
    to: account,
    value: parseEther("0.1")
  });
  await client.waitForTransactionReceipt({ hash });
  return hash
}

export const mintMockNFT = async (to: string) => {
  if(!isAddress(to)) throw new Error('invalid account address');
  const hash = await funder.sendTransaction({
    to: testNftContractAddr,
    data: mintCallData(to, testNftUri)
  });
  await client.waitForTransactionReceipt({ hash });
  return hash;
}

export const burnMockNFT = async (signer: WalletClient, tokenId: bigint) => {
  const hash = await signer.sendTransaction({
    to: testNftContractAddr,
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
      abi: testNftContractAbi,
      functionName: 'safeMint',
      args: [to, uri]
  });
}

function burnCallData (
  tokenId: bigint
) {
  return encodeFunctionData({
      abi: testNftContractAbi,
      functionName: 'burn',
      args: [ tokenId ]
  });
}