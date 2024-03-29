import { polygonMumbai, sepolia } from 'viem/chains';
import contracts from './contracts.json';
import erc721 from './ERC721.artifact.json';

export * from './contracts';

export const erc721abi = erc721.abi;

const base_goerli = 84531;

/* mumbai */
export const mumbaiFactoryContract = contracts[polygonMumbai.id][0].contracts.SmartAccountFactory; // same address in: baseGoerli, PolygonMumbai
//
// export const mktPlaceContract = contracts[base_goerli][0].contracts.MarketPlace;
// export const receiptsContract = contracts[base_goerli][0].contracts.ReceiptNFT;
// 
export const mumbaiMktPlaceContract = contracts[polygonMumbai.id][0].contracts.MarketPlace;
export const mumbaiReceiptsContract = contracts[polygonMumbai.id][0].contracts.ReceiptNFT;
export const mumbaiMockNftContract = contracts[polygonMumbai.id][0].contracts.NFT;
export const mumbaiTestNftContract = contracts[polygonMumbai.id][0].contracts.TestNFT;

/* sepolia */
export const factoryContract = contracts[sepolia.id][0].contracts.SmartAccountFactory;
export const mktPlaceContract = contracts[sepolia.id][0].contracts.MarketPlace;
export const receiptsContract = contracts[sepolia.id][0].contracts.ReceiptNFT;
export const mockNftContract = contracts[sepolia.id][0].contracts.TestNFT;

/* abi */
export const factoryAbi = factoryContract.abi;
export const mktPlaceAbi = mktPlaceContract.abi;