import { Client } from '@covalenthq/client-sdk';
import { Chains } from '@covalenthq/client-sdk/dist/services/Client';

const apiKey = process.env.NEXT_PUBLIC_COVALENT_KEY;
console.log(process)

if (!apiKey) {
  throw new Error('COVALENT_KEY is not defined in .env file');
}

const client = new Client(apiKey);

export async function fetchNFTData(network: string, address: string) {
  try {
    const response = await client.BalanceService.getTokenBalancesForWalletAddress(network as Chains, address, { nft: true });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching NFT data');
  }
}
