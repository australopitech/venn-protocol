import { useEffect, useState } from "react";
import { useBlockNumber, usePublicClient } from "wagmi";
import { LatesBlockReturnType } from "@/types";

export function useTimestamp () {
  const [timestamp, setTimestamp] = useState<bigint>();
  const { data: block } = useBlockNumber();
  const client = usePublicClient();
  useEffect(() => {
    const resolveTimestamp = async () => {
      const _block = await client.getBlock({blockNumber: block})
      setTimestamp(_block.timestamp)
    }
  }, [block]);
  return timestamp;
}

export function useLatestBlock ({watch} : {watch?: boolean}) : LatesBlockReturnType {
  const [data, setData] = useState<any>();
  const { data: blockNumber, error, isLoading } = useBlockNumber({ watch });
  const client = usePublicClient();
  useEffect(() => {
    const resolveBlock = async () => {
      setData( await client.getBlock({ blockNumber }))
    }
    resolveBlock();
  }, [blockNumber]);
  return { data, error, isLoading }
}

export function useBaseFee ({watch} : {watch?: boolean}) {
  const { data: block, error, isLoading } = useLatestBlock({ watch });
  return { data: block?.baseFeePerGas, error, isLoading }
}