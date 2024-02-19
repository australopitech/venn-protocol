import { polygonMumbai } from 'viem/chains';
import contracts from './contracts.json';
import erc721 from './ERC721.artifact.json'

export const erc721abi = erc721.abi;

const base_goerli = 84531;

export const factoryContract = contracts[polygonMumbai.id][0].contracts.SmartAccountFactory; // same address in: baseGoerli, PolygonMumbai
//
// export const mktPlaceContract = contracts[base_goerli][0].contracts.MarketPlace;
// export const receiptsContract = contracts[base_goerli][0].contracts.ReceiptNFT;
// 
export const mktPlaceContract = contracts[polygonMumbai.id][0].contracts.MarketPlace;
export const receiptsContract = contracts[polygonMumbai.id][0].contracts.ReceiptNFT;