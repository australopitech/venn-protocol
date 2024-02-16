import { Block } from "viem";

export type LatesBlockReturnType = {
    data?: Block,
    error?: Error | null,
    isLoading: boolean
}