
import { BalancesResponse, BalanceItem, NftData, NftItem, FetchNftDataResponse } from '../types/typesNftApi';
import { fetchAddressData } from '../utils/frontendUtils'
import { useEffect, useState } from "react";

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
          nfts.push({nftData: nft, contractAddress: curAddress, owner: address})
        }
      } 
    }
  }
  return nfts;
}

export function useAddressNfts (address: string | undefined) : FetchNftDataResponse {
  const [nfts, setNfts] = useState<NftItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const apiData = await fetchAddressData("base-testnet", address);
          const nfts = await processApiData(apiData, address);
          setNfts(nfts);
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

  return { nfts, error, isLoading };
}

