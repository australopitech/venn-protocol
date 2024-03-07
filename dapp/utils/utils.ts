import { getAddress } from "viem";
import { mktPlaceContract } from "./contractData";
import { TimeUnitType } from "@/types";

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

export function formatGasParams(params: any[]) {
  const ret: bigint[] = new Array();
  params.map((p) => {
    ret.push(p ? BigInt(p) : p)
  });
  return ret;
}

export function bigint_min(a: bigint, b: bigint) {
  if(typeof a !== typeof b)
    throw new Error("can't compare different types");
  if(a > b)
    return b
  else
    return a
}

export async function copyAddress (address?: string) {
  if(!address) return;
  await navigator.clipboard.writeText(address);
}

// time in secs
const dayCutOff = 82800n; // 23 h;
const hourCutOff = 3540n; // 59 min;
const day = 86400n; // 24h
const hour = 3600n;
const min = 60n;

export function timeLeftString (timeLeft: bigint) {
  return timeLeft >= dayCutOff
  ? `${parseFloat(String(timeLeft/86400n)).toFixed(1)} ${timeLeft/86400n < 2n ? 'day' : 'days'}`
  : timeLeft >= hourCutOff
    ? `${parseFloat(String(timeLeft/3600n)).toFixed(1)} ${timeLeft/3600n < 2n ? 'hour' : 'hours'}`
    : timeLeft >= 60n
      ? `${parseFloat(String(timeLeft/60n)).toFixed(0)} ${timeLeft < 120n ? 'minute' : 'minutes' }`
      : timeLeft > 0 ? 'less than a minute' : 'expired'
}

export const convertUnitToSec = (value: bigint | number, unit: TimeUnitType) => {
  if(typeof value === 'number') {
    return unit === 'day'
     ? value * 60 * 60 * 24
     : unit === 'hour'
      ? value * 60 * 60
      : value * 60
  }
  return unit === 'day'
     ? value * 60n * 60n * 24n
     : unit === 'hour'
      ? value * 60n * 60n
      : value * 60n
}

export const convertFromSec = (value: bigint | number | string, unit: TimeUnitType) => {
  let _value: bigint;
  if(typeof value !== 'bigint')
    _value = BigInt(value);
  else
    _value = value;
  return unit === 'day'
    ? _value / 60n / 60n / 24n
    : unit === 'hour'
      ? _value / 60n / 60n
      : _value / 60n
}