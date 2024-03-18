import { UserOperationStruct } from "@alchemy/aa-core";
import { bigint_min, formatGasParams} from "./utils";


export const extractGasEstimate = (userOp: UserOperationStruct, baseFee: bigint) => {
    const gasData = [userOp.callGasLimit, userOp.preVerificationGas, userOp.verificationGasLimit, userOp.maxFeePerGas, userOp.maxPriorityFeePerGas];
    const errorData = ['callGasLimit', 'preVerificationGas', 'verificationGasLimit', 'maxFeePerGas', 'maxPriorityFeePerGas'];
    let notFound: string[] = new Array();
    gasData.map((g, i) => {
        if(g === undefined)
            notFound.push(errorData[i])
    });
    if(notFound.length)
        throw new Error(`the following params were returned with no value: ${notFound}`);
    const [callGasLimit, preVerificationGas, verificationGasLimit, maxFeePerGas, maxPriorityFeePerGas] = formatGasParams(gasData);
    const totalGas = callGasLimit + preVerificationGas + verificationGasLimit;
    const gasFee = bigint_min(maxFeePerGas, maxPriorityFeePerGas + baseFee);
    return [totalGas, gasFee];
}