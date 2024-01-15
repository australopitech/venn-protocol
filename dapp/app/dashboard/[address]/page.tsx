import AddressPage from "./address-page";
import WagmiProvider from "@/app/wagmi";
import { VennAccountProvider } from "@/app/venn-provider";

export default function Page () {
  return (
    <VennAccountProvider>
      <WagmiProvider>
          <AddressPage />
      </WagmiProvider>
    </VennAccountProvider>
  )
}