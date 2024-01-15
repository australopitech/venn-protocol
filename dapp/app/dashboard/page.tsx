import AddressPage from "./dashboard";
import WagmiProvider from "@/app/wagmi";
import { VennAccountProvider } from "../venn-provider";

export default function Page () {
  return (
    <VennAccountProvider>
      <WagmiProvider>
          <AddressPage />
      </WagmiProvider>
    </VennAccountProvider>
  )
}