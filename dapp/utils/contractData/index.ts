import contracts from './contracts.json';

const base_goerli = 84531;

export const factoryContract = contracts[base_goerli][0].contracts.RWalletFactory; // same address in: baseGoerli, PolygonMumbai
//
export const mktPlaceContract = contracts[base_goerli][0].contracts.MarketPlace;
export const receiptsContract = contracts[base_goerli][0].contracts.ReceiptNFT;