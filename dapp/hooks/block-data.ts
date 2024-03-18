import { useEffect, useState } from "react";
import { useBlockNumber, usePublicClient } from "wagmi";
import { LatesBlockReturnType } from "@/types";

type UseBlockDataArgs = {
  watch?: boolean
}

export function useTimestamp (args? : UseBlockDataArgs) {
  const [data, setData] = useState<bigint>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>();
  const { watch } = args ?? { undefined };
  const { data: block, error: blockErr, isLoading: blockIsLoading } = useBlockNumber({ watch });
  const client = usePublicClient();
  useEffect(() => {
    if(blockErr){
      setError(blockErr)
      return
    }
    const resolveTimestamp = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const _block = await client.getBlock({blockNumber: block})
        setData(_block.timestamp)
      } catch(err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    resolveTimestamp();
  }, [block]);
  return { data, error, isLoading: isLoading?? blockIsLoading };
}

export function useLatestBlock (args?: UseBlockDataArgs) : LatesBlockReturnType {
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>();
  const { watch } = args ?? { undefined };
  const { data: blockNumber, error: blockErr, isLoading: blockIsLoading } = useBlockNumber({ watch });
  const client = usePublicClient();
  // TODO use isLoading
  useEffect(() => {
    const resolveBlock = async () => {
      try {
        setData( await client.getBlock({ blockNumber }))
      } catch(err) {
        console.error(err);
        setError(err);
      }
    }
    resolveBlock();
  }, [blockNumber]);
  return { data, error: error?? blockErr, isLoading: isLoading?? blockIsLoading }
}

export function useBaseFee (args?: UseBlockDataArgs) {
  const { watch } = args ?? { undefined };
  const { data: block, error, isLoading } = useLatestBlock({ watch });
  return { data: block?.baseFeePerGas, error, isLoading }
}