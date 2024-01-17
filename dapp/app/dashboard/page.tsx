import AddressPage from "./dashboard";
import WagmiProvider from "@/app/wagmi";
import { VennAccountProvider } from "../venn-provider";

export default function Page () {
  return (
    <WagmiProvider>
        <VennAccountProvider>
          <AddressPage />
        </VennAccountProvider>
    </WagmiProvider>

  )
}