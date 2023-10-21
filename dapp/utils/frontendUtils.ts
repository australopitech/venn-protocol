// Importing types
import { BalancesResponse } from '../types/typesNftApi';

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