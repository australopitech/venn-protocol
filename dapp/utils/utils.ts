import { getAddress } from "viem";
import { mktPlaceContract } from "./contractData";

export function compactString(input?: string): string {
  if (!input) {
    return '';
  }
  
  if (input.length <= 9) {
      return input; // If the string is less than or equal to 9 characters, return it as is.
  }

  const left = input.substring(0, 5);
  const right = input.substring(input.length - 4);
  return `${left}...${right}`;
}

export function formatParams(method: string, params: any[]) {
  let _params = params;
  if(
    method === "eth_sign" ||
    method === "eth_signTypedData_v4"
  )
    _params[0] = getAddress(params[0]) as `0x${string}`;
  if(method === "personal_sign")
    _params[1] = getAddress(params[1]) as `0x${string}`;
  return _params;
}

