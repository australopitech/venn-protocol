import { polygonMumbai } from 'viem/chains';
import contracts from './contracts.json';

const base_goerli = 84531;

export const factoryContract = contracts[polygonMumbai.id][0].contracts.SmartAccountFactory; // same address in: baseGoerli, PolygonMumbai
//
// export const mktPlaceContract = contracts[base_goerli][0].contracts.MarketPlace;
// export const receiptsContract = contracts[base_goerli][0].contracts.ReceiptNFT;
// 
export const mktPlaceContract = contracts[polygonMumbai.id][0].contracts.MarketPlace;
export const receiptsContract = contracts[polygonMumbai.id][0].contracts.ReceiptNFT;