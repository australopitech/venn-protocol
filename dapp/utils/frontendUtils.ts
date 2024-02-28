import { BalancesResponse, TransactionResponse } from "@/types";

// Function to fetch address data
export async function fetchAddressData (network: string, address: string): Promise<BalancesResponse> {
  const response = await fetch(`/api/addressData?network=${network}&address=${address}`);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Something went wrong');
  }

  const data: BalancesResponse = await response.json();
  console.log(data);
  return data;
};

export async function fetchTxData (network: string, txHash: string): Promise<TransactionResponse> {
  const response = await fetch(`/api/txData?network=${network}&txHash=${txHash}`);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Something went wrong');
  }

  const data: TransactionResponse = await response.json();
  return data;
};
