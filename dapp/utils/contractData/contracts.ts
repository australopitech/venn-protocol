import { getAddress } from "viem";
import { receiptsContract } from ".";
import { mktPlaceContract } from ".";
import { factoryContract } from ".";

export const getReceiptsContractAddress = (chainId?: number) => {
    return getAddress(receiptsContract.address);
}

export const getMktPlaceContractAddress = (chainId?: number) => {
    return getAddress(mktPlaceContract.address);
}

export const getFactoryContractAddress = () => {
    return getAddress(factoryContract.address);
}
