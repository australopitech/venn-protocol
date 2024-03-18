import { useSmartAccount } from "@/app/account/venn-provider";
import { ApproveData } from "@/types";
import { useEffect, useState } from "react";
import { useBlockNumber } from "wagmi";
import { useBaseFee } from "./block-data";
import { extractGasEstimate } from "@/utils/userOp";

interface GasEstimationArgs {
    approveData?: ApproveData;
    blocker?: boolean;
}

export function useGasEstimation({approveData, blocker}: GasEstimationArgs) {
  const [data, setData] = useState<bigint>();
  const [gasFee, setGasFee] = useState<bigint>();
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { provider } = useSmartAccount();
  const { data: blockNum, error: blockErr } = useBlockNumber({ watch: true });
  const { data: baseFee, error: feeErr } = useBaseFee({ watch: true });

  useEffect(() => {
    if(blocker)
        return
    if(approveData && provider && baseFee && blockNum) {
        const resolveGas = async () => {
            if(approveData.type === 'Signature' || approveData.type === 'Connection')
                return
            setError(undefined)
            setIsLoading(true);
            let target: `0x${string}` = '0x';
            let value: bigint | undefined;
            let data: `0x${string}` = '0x';
            if(approveData.type === 'Transfer' || approveData.type === 'Internal') {
                target = approveData.data.targetAddress;
                value = approveData.data.value;
                data = approveData.data.calldata ?? '0x';  
            } else if (approveData.type === 'Transaction') {
                const [params] = approveData.data.params.request.params;
                target = params.to
                value = params.value? BigInt(params.value) : 0n
                data = params.data
            }
            try {
                const uo = await provider.buildUserOperation({
                  target,
                  value,
                  data
                });
                const [_gas, _gasFee] = extractGasEstimate(uo, baseFee);
                setData(_gas)
                setGasFee(_gasFee)
            } catch(err) {
                console.error(err);
                setError(err);
            } finally{
                setIsLoading(false);
            }
        }
        resolveGas();            
    }
  }, [blockNum])
  return { data, gasFee, isLoading, error: error?? blockErr?? feeErr }
}


