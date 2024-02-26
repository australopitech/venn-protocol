import { useQuery, useQueryClient } from 'react-query';
import { BalancesResponse, NftItem, FetchNftDataResponse } from '@/types';
import { fetchAddressData } from '../utils/frontendUtils'
import { useEffect, useState } from "react";
import { isRental } from '@/utils/listing-data';
import { usePublicClient } from 'wagmi';


const processApiData = async (apiData: BalancesResponse, address: string | undefined) => {
  if (!apiData) {
    return null;
  }
  let curAddress = '';
  let nfts : NftItem[] | null = [];
  for (let item of apiData.items) {
    if (curAddress != item.contract_address) {
      curAddress = item.contract_address;
    }
    if (item.nft_data) {
      for (let nft of item.nft_data) {
        if (nft.external_data) {
          nfts.push({nftData: nft, contractAddress: curAddress, owner: address, isRental: undefined})
        }
      } 
    }
  }
  return nfts;
}

async function getRentalData(provider: any, nfts: NftItem[]): Promise<NftItem[]> {
  const promises = nfts.map((nft) => {
    return nft.nftData.token_id
     ? isRental(nft.contractAddress, BigInt(nft.nftData.token_id), nft.owner, provider)
     : undefined;
  });
  try {
    const results = await Promise.all(promises);
    const nftRentalData: NftItem[] = nfts.map((nft, i) => {
      return { ...nft, isRental: results[i] }; // Assuming you want to add isRental to the existing nft object
    });
    return nftRentalData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useAddressNfts (address: string | undefined): FetchNftDataResponse {
  const client = usePublicClient();

  // First useQuery to fetch and process address data
  const addressDataQuery = useQuery({
    queryKey: ['addressData', address],
    queryFn: () => fetchAddressData("matic-mumbai", address!).then(apiData => processApiData(apiData, address)),
    enabled: !!address,
    staleTime: 600000, // Data is considered fresh for 1 minute
    refetchInterval: 600000, // Data will be refetched every 1 minute
  });

  // Second useQuery to fetch rental data, dependent on the result of the first query
  const rentalDataQuery = useQuery({
    queryKey: ['rentalData', address],
    queryFn: () => getRentalData(client, addressDataQuery.data!),
    enabled: !!address && !!addressDataQuery.data,
    staleTime: 600000,
    refetchInterval: 600000,
  });

  // Combine loading states and errors
  const isLoading = addressDataQuery.isLoading || rentalDataQuery.isLoading;
  const isFetching = addressDataQuery.isFetching || rentalDataQuery.isFetching;
  const error = addressDataQuery.error || rentalDataQuery.error;

  // Transform the error into the expected shape if needed
  const transformedError = error ? (error instanceof Error ? error.message : 'An unknown error occurred.') : null;

  return { 
    nfts: rentalDataQuery.data ?? null, 
    error: transformedError, 
    isLoading,
    isFetching
  };
}

// Custom hook that returns the refetchAddressData function
export const useRefetchAddressData = () => {
  const queryClient = useQueryClient();

  const refetchAddressData = (address: string, force: boolean = false) => {
    console.log('refetch force', force, address);
    const addressKey = ['addressData', address];
    const rentalKey = ['rentalData', address];
    queryClient.invalidateQueries(addressKey);
    if (force) {
      console.log('flag 1')
      queryClient.refetchQueries({stale: true});
      // queryClient.refetchQueries(rentalKey);
      // console.log('query client', queryClient)
    } else {
      queryClient.invalidateQueries(addressKey);
      queryClient.refetchQueries(rentalKey);
    }
  };

  return refetchAddressData;
};
