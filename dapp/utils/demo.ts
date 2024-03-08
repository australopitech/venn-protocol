import { createPublicClient, createWalletClient, http, isAddress, parseEther } from "viem"
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";

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