import { useState, useEffect, useMemo } from "react";
import { useNetwork, usePublicClient } from "wagmi";
import { getEndTime, getListData, getRealNft, ownerOf, isApproved } from "@/utils/listing-data";
import { useTimestamp } from "./block-data";
import { getMktPlaceContractAddress } from "@/utils/contractData";

interface NftDataArgs {
  contract?: `0x${string}`,
  tokenId?: bigint,
  owner?: `0x${string}`,
}

interface NftDataHookArgs extends NftDataArgs {
  trigger?: boolean;
}


interface NftDataObj {
  contract: `0x${string}`,
  tokenId: bigint
}

export function useRealNft(args?: NftDataArgs) {
  const [data, setData] = useState<NftDataObj>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = usePublicClient();
//   const { chain } = useNetwork();
  const memoizedArgs = useMemo(() => args, [args?.contract, args?.tokenId]);
  
  useEffect(() => {
    console.log('render')
    if(!args)
      return
    const { contract, tokenId } = args;
    if(!contract || tokenId === undefined) {
      // console.error('error: missing args')
      // setError({ message: 'error: missing args' })
      return
    }
    setError(null);
    const resolveRealNft = async () => {
      setIsLoading(true)
      try {
        setData( await getRealNft(client, contract, tokenId))
      } catch (err) {
        console.error(err);
        setError(err)
      } finally {
        setIsLoading(false);
      }
    }
    resolveRealNft();
  }, [memoizedArgs]);
  
  return { data, error, isLoading }
}

export function useHolder(args? : NftDataArgs) {
  const [data, setData] = useState<`0x${string}`>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = usePublicClient();

  const memoizedArgs = useMemo(() => args, [args?.contract, args?.tokenId]);

  useEffect(() => {
    if(!args)
        return
    const { contract, tokenId } = args;
    console.log('args', args)
    if(!contract || tokenId === undefined) {
        // console.error('error: missing args');
        // setError({ message: 'error: missing args'});
        return
    }
    const resolveHolder = async() => {
      setError(null);
      setIsLoading(true);
      try {
        setData(await ownerOf(client, contract, tokenId ));
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    resolveHolder();
  }, [memoizedArgs]);
  
  return { data, error, isLoading }
}

export function useIsAppoved(args?: NftDataHookArgs) {
  const [data, setData] = useState<boolean>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = usePublicClient();
  const { chain } = useNetwork();
  const memoizedArgs = useMemo(() => args, [
    args?.contract, args?.tokenId, args?.owner, args?.trigger
  ]);

  useEffect(() => {
    if(!args)
      return
    const { contract, tokenId, owner } = args;
    if(!contract || !owner || tokenId === undefined)
      return
    const resolveIsApproved = async () => {
      setError(null);
      setIsLoading(true);
      try {
        setData(await isApproved(
          client,
          contract,
          tokenId,
          owner,
          getMktPlaceContractAddress(chain?.id)
        ))
      } catch (err) {
        console.error(err);
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    resolveIsApproved()
  }, [memoizedArgs]);
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
    if(!contract || tokenId === undefined) {
      // console.error('missing args');
      // setError({ message: 'error: missing args'});
      return
    }
    const resolveListingData = async () => {
      setError(null);
      setIsLoading(true)
      try {
        setData( await getListData(client, contract, tokenId))
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false)
      }
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
  const memoizedNFT = useMemo(() => nft.data, [nft.data?.contract, nft.data?.tokenId]);
  const holder = useHolder(memoizedNFT);
  const memoizedHolder = useMemo(() => holder.data, [holder.data]);
  const timestamp = useTimestamp();
  const memoizedTimestamp = useMemo(() => timestamp.data, [timestamp.data])

  useEffect(() => {
    console.log('render')
    if(!nft.data || !holder.data || !timestamp.data)
      return
    const { contract, tokenId } = nft.data;
    if(!contract || tokenId === undefined) {
      // console.error('missing args');
      // setError({ message: 'error: missing args'});
      return
    }
    const resolveTimeLeft = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const endTime = await getEndTime(client, holder.data, contract, tokenId )
        if(!endTime)
          throw new Error('could not fecth endTime')
        setData( endTime - timestamp.data!)
      } catch (err) {
        console.error(err)
        setError(err);
      } finally {
        setIsLoading(false)
      }
    }
    resolveTimeLeft();
  }, [client, memoizedNFT, memoizedHolder, memoizedTimestamp]);

  return { 
    data,
    error: error ?? nft.error ?? holder.error ?? timestamp.error,
    isLoading 
  }
}