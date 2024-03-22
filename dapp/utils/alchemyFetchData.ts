import { RouteNftResponse, NftItem, VennNftItem} from "@/types";

const apiKey = process.env.SEPOLIA_ALCHEMY_API_KEY;

function bigintReplacer(key: string, value: any) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

function getNftsFromData (alchemyResponse: any, address: string) {
  let nfts : VennNftItem[] | null = [];
  if (alchemyResponse.totalCount > 0 && alchemyResponse.ownedNfts) {
    for (let nft of alchemyResponse.ownedNfts) {
      const image : string | null = nft.image.originalUrl ?? null;
      const cachedImage : string | null = nft.image.cachedUrl ?? null;
      nfts.push({
        contractAddress: nft.contract?.address as string,
        owner: address,
        tokenId: nft.tokenId as string,
        name: nft.name as string,
        description: nft.description as string,
        tokenUri: nft.tokenUri,
        image: image,
        imageCached: cachedImage,
        isRental: null
      })
    }
  }
  return nfts;
}

function processApiData (apiData: any, address: string): RouteNftResponse {
  const nftItems = getNftsFromData(apiData, address);
  const validAt = apiData.validAt;
  return {
    nfts: nftItems,
    validAt
  }
}

export async function fetchAddressDataAlchemy (network: string, address: string) {
//   console.log('MUMBAI_ALCHEMY_API_KEY', process.env.MUMBAI_ALCHEMY_API_KEY)
  const options = {method: 'GET', headers: {accept: 'application/json'}};

  try {
    const response = await fetch(`https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=100`, options)
    const responseJson = await response.json();
    const apiData = processApiData(responseJson, address);
    // console.log(apiData)
    const data = JSON.stringify(apiData, bigintReplacer);
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching NFT data');
  }
} 