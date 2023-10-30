
import { BalancesResponse, BalanceItem, NftData, NftItem, FetchNftDataResponse } from '../types/typesNftApi';
import { fetchAddressData } from '../utils/frontendUtils'
import { useEffect, useState } from "react";
import { useEthers } from '@usedapp/core';
import { checkIsRental } from '@/utils/utils';
import { BigNumber } from 'ethers';

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
    return checkIsRental(provider, nft.owner, nft.contractAddress, BigNumber.from(nft.nftData.token_id));
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


export function useAddressNfts (address: string | undefined) : FetchNftDataResponse {
  const [nfts, setNfts] = useState<NftItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { library } = useEthers();

  useEffect(() => {
    if (address) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const apiData = await fetchAddressData("base-testnet", address);
          let nfts = await processApiData(apiData, address);
          if (nfts) {
            nfts = await getRentalData(library, nfts);
          }
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

