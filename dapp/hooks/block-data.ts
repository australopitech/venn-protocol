import { useEffect, useState } from "react";
import { useBlockNumber, usePublicClient } from "wagmi";

export function useTimestamp () {
  const [timestamp, setTimestamp] = useState<bigint>();
  const { data: block, isError, isLoading } = useBlockNumber();
  const client = usePublicClient();
  useEffect(() => {
    const resolveTimestamp = async () => {
      const _block = await client.getBlock({blockNumber: block})
      setTimestamp(_block.timestamp)
    }
  }, [block]);
  return timestamp;
}