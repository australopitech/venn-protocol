import { Client } from '@covalenthq/client-sdk';
import { Chains } from '@covalenthq/client-sdk/dist/services/Client';
import {
  BalancesResponse,
  NftItem,
  RouteNftResponse,
  VennNftItem
} from '@/types';

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

function getNftsFromDataOld (apiData: BalancesResponse, address:string) {
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

function getNftsFromData (apiData: BalancesResponse, address:string) {
  let curAddress = '';
  let nfts : VennNftItem[] | null = [];
  for (let item of apiData.items) {
    if (curAddress != item.contract_address) {
      curAddress = item.contract_address;
    }
    if (item.nft_data) {
      for (let nft of item.nft_data) {
        if (nft.external_data) {
          nfts.push({
            contractAddress: curAddress,
            owner: address,
            tokenId: nft.token_id,
            tokenUri: nft.token_url,
            name: nft.external_data.name,
            description: nft.external_data.description,
            image: nft.external_data.image,
            imageCached: nft.external_data.image_1024,
            isRental: null
          })
        }
      } 
    }
  }
  return nfts;
}

function processApiData (apiData: BalancesResponse, address: string): RouteNftResponse {
  const nftItems = getNftsFromData(apiData, address);
  const validAt = null;
  return {
    nfts: nftItems,
    validAt
  }
}

export async function fetchBalancesDataCovalent (network: string, address: string) {
  try {
    const response = await client.BalanceService.getTokenBalancesForWalletAddress(network as Chains, address, { nft: true });
    const apiData = processApiData(response.data as BalancesResponse, address);
    const data = JSON.stringify(apiData, bigintReplacer);
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching NFT data');
  }
}
