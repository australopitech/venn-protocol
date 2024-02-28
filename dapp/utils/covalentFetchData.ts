import { Client } from '@covalenthq/client-sdk';
import { Chains } from '@covalenthq/client-sdk/dist/services/Client';

const apiKey = process.env.COVALENT_KEY;

if (!apiKey) {
  throw new Error('COVALENT_KEY is not defined in .env file');
}

const client = new Client(apiKey);

function bigintReplacer(key: string, value: any) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

export async function fetchBalancesData(network: string, address: string) {
  try {
    const response = await client.BalanceService.getTokenBalancesForWalletAddress(network as Chains, address, { nft: true });
    const data = JSON.stringify(response.data, bigintReplacer);
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching NFT data');
  }
}

export async function fetchTransactionsData(network: string, txHash: string) {
  try {
    const response = await client.TransactionService.getTransaction(network as Chains, txHash);
    const data = JSON.stringify(response.data, bigintReplacer);
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching transactions data');
  }
}
