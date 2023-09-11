
import { BalancesResponse, BalanceItem, NftData } from '../types/types';
import { fetchAddressData } from '../utils/frontendUtils'
import { useEffect, useState, useRef } from "react";

export function useAddressData(address: string | undefined) {
  const [data, setData] = useState<BalancesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const data = await fetchAddressData('base-mainnet', address);
          setData(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred.');
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [address]);

  return { data, error, isLoading };
}

export function useAddressNfts (address: string | undefined) : {
  nfts: { nftData: NftData; contractAddress: string }[] | undefined;
  error: string | null;
  isLoading: boolean;
} {
  const userData = useAddressData(address);

  const data = userData.data;
  const error = userData.error;
  const isLoading = userData.isLoading;

  let nfts : {nftData: NftData, contractAddress: string}[] | undefined = undefined;
  if (data) {
    let curAddress = '';
    nfts = [];
    for (let item of data.items) {
      if (curAddress != item.contract_address) {
        curAddress = item.contract_address;
      }
      if (item.nft_data) {
        for (let nft of item.nft_data) {
          if (nft.external_data) {
            nfts.push({nftData: nft, contractAddress: curAddress})
          }
        } 
      }
    }
  }

  return { nfts, error, isLoading };
}