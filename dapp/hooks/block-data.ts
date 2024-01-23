// import { useMulticallAddress } from "@usedapp/core";
// import { QueryParams } from "@usedapp/core";
// import { useRawCall } from "@usedapp/core";
// // import { useChainId } from "@usedapp/core/src/hooks/useChainId";
// import { useConfig } from "@usedapp/core";
// import { MultiCallABI } from "@usedapp/core";
// import { useMemo } from "react";

// const GET_CURRENT_BLOCK_TIMESTAMP_CALL = MultiCallABI.encodeFunctionData('getCurrentBlockTimestamp', []);

// export function useTimestamp(queryParams: QueryParams = {}) {
//   const { readOnlyChainId } = useConfig()
//   const chainId = queryParams.chainId ?? readOnlyChainId;
//   const { refresh: configRefresh } = useConfig();

//   const address = useMulticallAddress(queryParams);
//   const refresh = queryParams.refresh ?? configRefresh;
//   const isStatic = queryParams.isStatic ?? refresh === 'never';
//   const refreshPerBlocks = typeof refresh === 'number' ? refresh : undefined;
//   const timestampResult = useRawCall(
//     address &&
//       chainId !== undefined && {
//         address,
//         data: GET_CURRENT_BLOCK_TIMESTAMP_CALL,
//         chainId,
//         isStatic,
//         refreshPerBlocks,
//       }
//   );

//   const timestamp = useMemo(() => {
//     try {
//       return timestampResult !== undefined
//         ? parseInt(timestampResult.value, 16)
//         : undefined
//     } catch(e: any) {
//       console.warn('Failed to parse timestamp of a block', e)
//     }
//   }, [timestampResult]);

//   return timestamp;
// }

