import { RouteNftResponse } from "@/types";

// Function to fetch address data
export async function fetchAddressData (network: string, address: string): Promise<RouteNftResponse> {
  const response = await fetch(`/api/addressData?network=${network}&address=${address}`);
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Something went wrong');
  }

  const data: RouteNftResponse = await response.json();
  console.log(data);
  return data;
};