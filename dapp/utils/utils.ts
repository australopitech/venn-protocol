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
  ? `${(parseFloat(String(timeLeft))/parseFloat(String(day))).toFixed(1)} ${timeLeft/day < 2n ? 'day' : 'days'}`
  : timeLeft >= hourCutOff
    ? `${(parseFloat(String(timeLeft))/parseFloat(String(hour))).toFixed(1)} ${timeLeft/hour < 2n ? 'hour' : 'hours'}`
    : timeLeft >= 60n
      ? `${parseFloat(String(timeLeft/min))} ${timeLeft/min < 2n ? 'minute' : 'minutes' }`
      : timeLeft > 0 ? 'less than a minute' : 'expired'
}

export const convertUnitToSec = (value: bigint | number | string, unit: TimeUnitType) => {
  const _value = BigInt(value);
  return unit === 'day'
     ? _value * 60n * 60n * 24n
     : unit === 'hour'
      ? _value * 60n * 60n
      : _value * 60n
}

export const convertFromSec = (value: bigint | number | string, unit: TimeUnitType) => {
  const _value = BigInt(value);
  return unit === 'day'
    ? _value / 60n / 60n / 24n
    : unit === 'hour'
      ? _value / 60n / 60n
      : _value / 60n
}