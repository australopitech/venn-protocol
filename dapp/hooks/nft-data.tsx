import { useState } from "react";
import { useEffect } from "react";
import { NftObj } from "@/types";
import { useNetwork, usePublicClient } from "wagmi";
import { getEndTime, getListData, getRealNft, ownerOf } from "@/utils/listing-data";
import { useTimestamp } from "./block-data";

interface NftDataArgs {
    contract?: `0x${string}`,
    tokenId?: bigint,
}

export function useRealNft(args?: NftDataArgs) {
  const [data, setData] = useState<NftObj>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = usePublicClient();
//   const { chain } = useNetwork();
  
  useEffect(() => {
    if(!args)
      return
    const { contract, tokenId } = args;
    if(!contract || ! tokenId)
        return
    const resolveRealNft = async () => {
    //   setIsLoading(true)
      try {
        setData( await getRealNft(client, contract, tokenId))
      } catch (err) {
        console.error(err);
        setError(err)
      } finally {
        // setIsLoading(false);
      }
    }
    resolveRealNft();
  }, [args, client]);
  
  return { data, error, isLoading }
}

export function useHolder(args? : NftDataArgs) {
  const [data, setData] = useState<`0x${string}`>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = usePublicClient();

  useEffect(() => {
    if(!args)
        return
    const { contract, tokenId } = args;
    if(!contract || !tokenId) {
        console.error('missing args');
        setError({ message: 'error: missing args'});
        return
    }
    const resolveHolder = async() => {
    //   setIsLoading(true);
      try {
        setData(await ownerOf(client, contract, tokenId ));
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        // setIsLoading(false);
      }
    }
    resolveHolder();
  }, [args, client]);
  
  return { data, error, isLoading }
}

export function useListingData(args?: NftDataArgs) {
  const [data, setData] = useState<{price: bigint, maxDur: bigint}>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = usePublicClient();

  useEffect(() => {
    if(!args)
      return
    const { contract, tokenId } = args;
    if(!contract || !tokenId) {
      console.error('missing args');
      setError({ message: 'error: missing args'});
      return
    }
    const resolveListingData = async () => {
      // setIsLoading(true)
      try {
        setData( await getListData(client, contract, tokenId))
      } catch (err) {
        console.error(err);
        setError(err);
      }
      // setIsLoading(false)
    }
    resolveListingData();
  }, [args, client]);

  return { data, error, isLoading }
}

export function useTimeLeft(args?: NftDataArgs) {
  const [data, setData] = useState<bigint>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = usePublicClient();
  const nft = useRealNft(args);
  const holder = useHolder(nft.data);
  const timestamp = useTimestamp();

  useEffect(() => {
    if(!nft.data || !holder.data || !timestamp.data)
      return
    const { contractAddress, tokenId } = nft.data;
    if(!contractAddress || !tokenId) {
      console.error('missing args');
      setError({ message: 'error: missing args'});
      return
    }
    const resolveTimeLeft = async () => {
      try {
        const endTime = await getEndTime(client, holder.data, contractAddress, tokenId )
        if(!endTime)
          throw new Error('could not fecth endTime')
        setData( endTime - timestamp.data!)
      } catch (err) {
        console.error(err)
        setError(err);
      }
    }
    resolveTimeLeft();
  }, [client, args, nft, holder, timestamp]);

  return { 
    data,
    error: error ?? nft.error ?? holder.error ?? timestamp.error,
    isLoading 
  }
}