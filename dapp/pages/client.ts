import { createPublicClient, PublicClient, Chain, http } from "viem";
import { baseGoerli } from "viem/chains";

const baseTestProvider = process.env.NEXT_PUBLIC_BASE_GOERLI_PROVIDER;

export let client: PublicClient = createPublicClient({
    chain: baseGoerli,
    transport: http(baseTestProvider ?? '')
});

export function newClient(chain: Chain, transport?: string) {
    client = createPublicClient({
        chain,
        transport: http(transport ?? '')
    })
}