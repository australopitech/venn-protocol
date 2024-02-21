import { useState } from "react";
import { useEffect } from "react";
import { NftObj } from "@/types";
import { useNetwork, usePublicClient } from "wagmi";
import { getRealNft, ownerOf } from "@/utils/listing-data";

interface NftDataArgs {
    contract?: `0x${string}`,
    tokenId?: bigint,
}

export function useRealNft({ contract, tokenId }: NftDataArgs) {
  const [data, setData] = useState<NftObj>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = usePublicClient();
//   const { chain } = useNetwork();
  
  useEffect(() => {
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
  }, [contract, tokenId, client]);
  
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